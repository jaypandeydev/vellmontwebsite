import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';

// Run before paint on the client so GSAP 'from' start states never flash.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { ArrowUp, Check, Copy } from 'lucide-react';
import { gsap, ScrollTrigger, reduceMotion, MOTION, TRIGGER } from '@/lib/gsap';

// =============================================================================
// Global interaction + animation primitives for the Vellmont site.
// GSAP (with ScrollTrigger) is the animation engine. Everything here is
// reusable across pages and respects prefers-reduced-motion.
// =============================================================================

// -----------------------------------------------------------------------------
// ScrollProgress: brand bar at the very top, scrubbed by GSAP ScrollTrigger.
// -----------------------------------------------------------------------------
export function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });

    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: 0.25,
      onUpdate: (self) => gsap.set(el, { scaleX: self.progress }),
    });

    return () => st.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500"
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// BackToTop: GSAP fades it in past the first screen; smooth scroll on click.
// -----------------------------------------------------------------------------
export function BackToTop() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0, y: 12 });

    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 0.9,
      end: 'max',
      onToggle: (self) =>
        gsap.to(el, {
          autoAlpha: self.isActive ? 1 : 0,
          y: self.isActive ? 0 : 12,
          duration: MOTION.fast,
          overwrite: true,
        }),
    });
    return () => st.kill();
  }, []);

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Back to top"
      onClick={toTop}
      className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-[0_10px_30px_-10px_rgba(16,18,40,0.35)] transition-colors hover:bg-surface-2"
    >
      <ArrowUp size={18} strokeWidth={2} />
    </button>
  );
}

// -----------------------------------------------------------------------------
// CountUp: GSAP tweens the number when it scrolls into view.
// Handles "7", "28+", "4.6x", "37%", "< 60s"; non-numeric values pass through.
// -----------------------------------------------------------------------------
export function CountUp({ value, duration = 1.4, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = String(value).match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!match || reduceMotion()) {
      el.textContent = value;
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = (numStr.split('.')[1] || '').length;
    const counter = { v: 0 };
    let tween = null;

    // The final value stays rendered until the count actually starts, so the
    // number is never stuck showing zero if the trigger never fires.
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        tween = gsap.to(counter, {
          v: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${counter.v.toFixed(decimals)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = `${prefix}${numStr}${suffix}`;
          },
        });
      },
    });

    return () => {
      st.kill();
      if (tween) tween.kill();
    };
  }, [value, duration]);

  return <span ref={ref} className={className}>{value}</span>;
}

// -----------------------------------------------------------------------------
// CopyButton: copy text with confirmation feedback.
// -----------------------------------------------------------------------------
export function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch (e2) {}
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    },
    [text]
  );

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : `${label} ${text}`}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${className}`}
    >
      {copied ? <Check size={13} strokeWidth={2.2} /> : <Copy size={13} strokeWidth={2} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}

// -----------------------------------------------------------------------------
// Spotlight: card wrapper whose glow follows the cursor (see GlobalSpotlight
// for the page-wide version).
// -----------------------------------------------------------------------------
export function Spotlight({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Tag ref={ref} onMouseMove={onMove} className={`u-spotlight relative ${className}`}>
      {children}
    </Tag>
  );
}

// -----------------------------------------------------------------------------
// GlobalSpotlight: one listener powering the cursor glow on every
// `.u-spotlight` element, no per-card wiring.
// -----------------------------------------------------------------------------
export function GlobalSpotlight() {
  useEffect(() => {
    if (reduceMotion()) return;
    let frame = null;

    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const el = e.target && e.target.closest ? e.target.closest('.u-spotlight') : null;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

// -----------------------------------------------------------------------------
// GsapReveals: page-wide scroll animation engine.
//   data-anim            -> fade + rise
//   data-anim="left"     -> slide in from the left
//   data-anim="right"    -> slide in from the right
//   data-anim="scale"    -> subtle scale up
//   data-anim-group      -> stagger this element's direct children
//   data-parallax="0.15" -> gentle parallax drift while scrolling
// Mount once per page, after content renders.
// -----------------------------------------------------------------------------
export function GsapReveals() {
  useIsomorphicLayoutEffect(() => {
    if (reduceMotion()) {
      document
        .querySelectorAll('[data-anim], [data-anim-group]')
        .forEach((el) => gsap.set(el, { clearProps: 'all' }));
      return;
    }

    const ctx = gsap.context(() => {
      // Staggered groups first, so their children are not double-animated.
      gsap.utils.toArray('[data-anim-group]').forEach((group) => {
        const kids = gsap.utils.toArray(group.children);
        if (!kids.length) return;
        gsap.from(kids, {
          opacity: 0,
          y: 22,
          duration: MOTION.base,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          scrollTrigger: { trigger: group, ...TRIGGER },
        });
      });

      // Individual elements.
      gsap.utils.toArray('[data-anim]').forEach((el) => {
        if (el.closest('[data-anim-group]')) return;
        const kind = el.getAttribute('data-anim');
        const from = { opacity: 0, duration: MOTION.base, ease: MOTION.ease };
        if (kind === 'left') from.x = -36;
        else if (kind === 'right') from.x = 36;
        else if (kind === 'scale') {
          from.scale = 0.96;
          from.y = 16;
        } else from.y = 24;

        gsap.from(el, {
          ...from,
          scrollTrigger: { trigger: el, ...TRIGGER },
        });
      });

      // Parallax drift.
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        gsap.to(el, {
          yPercent: -amount * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      });
    });

    // Recalculate once images and fonts settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 600);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}

// -----------------------------------------------------------------------------
// useHeroTimeline: choreographed entrance for a hero. Pass a ref to the hero
// root; children marked data-hero="1|2|3..." animate in sequence.
// -----------------------------------------------------------------------------
export function useHeroTimeline(rootRef) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef && rootRef.current;
    if (!root || reduceMotion()) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils
        .toArray('[data-hero]', root)
        .sort(
          (a, b) =>
            Number(a.getAttribute('data-hero')) -
            Number(b.getAttribute('data-hero'))
        );
      if (!items.length) return;

      gsap
        .timeline({ defaults: { ease: MOTION.ease } })
        .from(items, {
          opacity: 0,
          y: 26,
          duration: MOTION.base,
          stagger: 0.09,
        })
        .from(
          '[data-hero-visual]',
          { opacity: 0, y: 34, scale: 0.985, duration: MOTION.slow },
          '-=0.5'
        );
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}

// -----------------------------------------------------------------------------
// Reveal: imperative wrapper for one-off elements (GSAP powered).
// -----------------------------------------------------------------------------
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const tween = gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: MOTION.base,
      ease: MOTION.ease,
      delay: delay / 1000,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// useAutoHideHeader: fades/slides a sticky header out when the reader scrolls
// down and brings it back the moment they scroll up. Always visible near the
// top of the page, and pinned open while `keepVisible` is true (for example
// when the mobile menu is open).
//   const ref = useRef(null);
//   useAutoHideHeader(ref, menuOpen);
// -----------------------------------------------------------------------------
export function useAutoHideHeader(ref, keepVisible = false, options = {}) {
  const { threshold = 90, tolerance = 6 } = options;
  const keepRef = useRef(keepVisible);
  const hiddenRef = useRef(false);

  // Keep the latest value without re-creating the ScrollTrigger.
  useEffect(() => {
    keepRef.current = keepVisible;
    if (keepVisible && hiddenRef.current && ref.current) {
      hiddenRef.current = false;
      gsap.to(ref.current, {
        yPercent: 0,
        autoAlpha: 1,
        duration: MOTION.fast,
        ease: MOTION.easeSoft,
        overwrite: true,
      });
    }
  }, [keepVisible, ref]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion()) {
      gsap.set(el, { yPercent: 0, autoAlpha: 1 });
      return;
    }

    let lastY = window.scrollY;

    const show = () => {
      if (!hiddenRef.current) return;
      hiddenRef.current = false;
      gsap.to(el, {
        yPercent: 0,
        autoAlpha: 1,
        duration: MOTION.fast,
        ease: MOTION.easeSoft,
        overwrite: true,
      });
    };

    const hide = () => {
      if (hiddenRef.current) return;
      hiddenRef.current = true;
      gsap.to(el, {
        yPercent: -100,
        autoAlpha: 0,
        duration: MOTION.fast,
        ease: MOTION.easeSoft,
        overwrite: true,
      });
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        const delta = y - lastY;

        // Ignore sub-pixel jitter and bounce at the extremes.
        if (Math.abs(delta) < tolerance) return;
        lastY = y;

        if (keepRef.current || y <= threshold) {
          show();
          return;
        }
        if (delta > 0) hide();
        else show();
      },
    });

    return () => {
      st.kill();
      gsap.set(el, { clearProps: 'transform,opacity,visibility' });
    };
  }, [ref, threshold, tolerance]);
}


// -----------------------------------------------------------------------------
// ClickSpark: a brand-coloured ring that blooms wherever the user clicks,
// anywhere on the page. Pure DOM, self-cleaning, skipped for reduced motion.
// -----------------------------------------------------------------------------
export function ClickSpark() {
  useEffect(() => {
    if (reduceMotion()) return undefined;

    const onDown = (e) => {
      // ignore synthetic/programmatic clicks
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const el = document.createElement('span');
      el.className = 'u-spark';
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      document.body.appendChild(el);
      const done = () => el.remove();
      el.addEventListener('animationend', done, { once: true });
      setTimeout(done, 900);
    };

    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return null;
}

// -----------------------------------------------------------------------------
// EdgeOrbs: soft brand shapes that loiter at the edges of the viewport and
// drift on long, offset loops. Fixed-position, behind everything, inert.
// -----------------------------------------------------------------------------
export function EdgeOrbs() {
  if (typeof window !== 'undefined' && reduceMotion()) return null;
  // A radial gradient fades out on its own, so we get the same soft edge a
  // 64px blur filter gave us without asking the browser to run an actual blur
  // pass over a 400px shape every frame.
  const orbs = [
    'left-[-8rem] top-[12%] h-[22rem] w-[22rem] bg-[radial-gradient(closest-side,rgba(88,72,248,0.20),rgba(88,72,248,0))]',
    'right-[-10rem] top-[38%] h-[26rem] w-[26rem] bg-[radial-gradient(closest-side,rgba(217,70,239,0.16),rgba(217,70,239,0))] [animation-delay:-8s]',
    'left-[-6rem] bottom-[8%] h-[20rem] w-[20rem] bg-[radial-gradient(closest-side,rgba(245,158,11,0.14),rgba(245,158,11,0))] [animation-delay:-16s]',
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {orbs.map((c) => (
        <div key={c} className={`u-orb absolute rounded-full ${c}`} />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// useActiveSection: id of the section currently in view, for nav highlighting.
// -----------------------------------------------------------------------------
export function useActiveSection(ids = []) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!ids.length) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(',')]);

  return active;
}
