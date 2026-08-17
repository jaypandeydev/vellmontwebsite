import React, { useEffect, useRef } from 'react';

/**
 * AmbientField — a living background layer.
 *
 * A sparse particle grid that drifts on its own, leans toward the cursor,
 * and ripples outward on click. Rendered to a single canvas so it stays cheap
 * no matter how many points are on screen.
 *
 * Behaviour:
 *   - idle:      points drift on slow independent orbits
 *   - proximity: points near the cursor brighten, grow, and pull toward it;
 *                near neighbours link with hairlines (a "system" feel)
 *   - click:     a ring expands from the point of click and shoves points out
 *   - offscreen: the animation loop stops entirely (IntersectionObserver)
 *   - hidden tab / reduced motion: nothing runs
 *
 * Usage: drop inside a `relative` parent.
 *   <AmbientField />
 */

const CFG = {
  spacing: 58,        // grid pitch in CSS px
  dotBase: 1.15,      // idle radius
  dotMax: 2.9,        // radius at the cursor
  influence: 150,     // cursor radius of effect
  pull: 0.16,         // how strongly points lean toward the cursor
  ease: 0.06,         // return-to-home easing
  linkDist: 74,       // neighbour-link threshold
  maxLinks: 26,       // cap the O(n^2) link pass so cost stays bounded
  rippleSpeed: 620,   // px/sec
  rippleWidth: 90,
  rippleForce: 26,
  // 1.5 rather than 2. These are 1-3px soft dots; nobody can see the extra
  // sharpness, but the pixel count (and therefore the cost of every frame)
  // scales with the square of this number.
  maxDpr: 1.5,
};

/**
 * tone: 'auto' follows the page theme. 'dark' forces the dark palette, which is
 * what a permanently dark card needs: in light mode the light palette paints
 * saturated indigo at 13% alpha, and on a near-black panel that is invisible.
 */
export default function AmbientField({ className = '', density = 1, tone = 'auto' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let raf = null;
    let running = false;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let points = [];
    let ripples = [];
    const pointer = { x: -9999, y: -9999, cx: 0, cy: 0, seen: false, active: false };
    const bucketPaths = [];
    const TAU = Math.PI * 2;

    const isDark = () =>
      tone === 'dark' || document.documentElement.classList.contains('dark');

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = CFG.spacing / Math.max(0.35, density);
      points = [];
      for (let y = step * 0.5; y < h; y += step) {
        for (let x = step * 0.5; x < w; x += step) {
          points.push({
            hx: x,
            hy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            // slow independent drift so the field is never perfectly still
            phase: Math.random() * Math.PI * 2,
            speed: 0.25 + Math.random() * 0.4,
            amp: 1.6 + Math.random() * 2.4,
          });
        }
      }
    };

    // Pointer events can fire far more often than the screen refreshes, and
    // reading an element's position forces the browser to stop and re-measure
    // the page. So we only stash the raw coordinates here and do the single
    // measurement once per frame, inside the draw loop.
    let rectLeft = 0;
    let rectTop = 0;
    const onPointerMove = (e) => {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.seen = true;
    };
    const onPointerLeave = () => {
      pointer.seen = false;
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onClick = (e) => {
      const x = e.clientX - rectLeft;
      const y = e.clientY - rectTop;
      if (x < 0 || y < 0 || x > w || y > h) return;
      ripples.push({ x, y, r: 0, born: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };

    const draw = (t) => {
      const dark = isDark();
      ctx.clearRect(0, 0, w, h);

      const rect = canvas.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop = rect.top;
      if (pointer.seen) {
        pointer.x = pointer.cx - rectLeft;
        pointer.y = pointer.cy - rectTop;
        pointer.active =
          pointer.x >= 0 && pointer.y >= 0 && pointer.x <= w && pointer.y <= h;
      }

      // advance ripples
      const now = t;
      ripples = ripples.filter((rp) => {
        rp.r = Math.max(0, ((now - rp.born) / 1000) * CFG.rippleSpeed);
        return rp.r < Math.hypot(w, h) * 0.75;
      });

      const dotRGB = dark ? '139,132,248' : '88,72,248';
      const near = [];

      // Dots are grouped into a few alpha buckets and each bucket is filled as
      // ONE path. That turns N fillStyle/fill state changes per frame into
      // BUCKETS of them, which is where the frame budget was going.
      const BUCKETS = 6;
      for (let i = 0; i < BUCKETS; i++) bucketPaths[i] = null;

      const infl2 = CFG.influence * CFG.influence;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // idle drift
        const homeX = p.hx + Math.cos(t * 0.0004 * p.speed + p.phase) * p.amp;
        const homeY = p.hy + Math.sin(t * 0.0005 * p.speed + p.phase * 1.3) * p.amp;

        // cursor attraction (squared distance, sqrt only when in range)
        let energy = 0;
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < infl2) {
            const d = Math.sqrt(d2) || 1;
            energy = 1 - d / CFG.influence;
            p.vx += (dx / d) * energy * CFG.pull;
            p.vy += (dy / d) * energy * CFG.pull;
          }
        }

        // ripple shove
        for (let k = 0; k < ripples.length; k++) {
          const rp = ripples[k];
          const dx = p.x - rp.x;
          const dy = p.y - rp.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const band = d - rp.r < 0 ? rp.r - d : d - rp.r;
          if (band < CFG.rippleWidth) {
            const f = (1 - band / CFG.rippleWidth) * CFG.rippleForce;
            p.vx += (dx / d) * f * 0.02;
            p.vy += (dy / d) * f * 0.02;
            const e2 = (1 - band / CFG.rippleWidth) * 0.8;
            if (e2 > energy) energy = e2;
          }
        }

        // spring home + damping
        p.vx += (homeX - p.x) * CFG.ease;
        p.vy += (homeY - p.y) * CFG.ease;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        const r = CFG.dotBase + (CFG.dotMax - CFG.dotBase) * energy;
        let b = (energy * BUCKETS) | 0;
        if (b > BUCKETS - 1) b = BUCKETS - 1;
        let path = bucketPaths[b];
        if (!path) {
          path = new Path2D();
          bucketPaths[b] = path;
        }
        path.moveTo(p.x + r, p.y);
        path.arc(p.x, p.y, r < 0.1 ? 0.1 : r, 0, TAU);

        if (energy > 0.18 && near.length < CFG.maxLinks) near.push(p);
      }

      // one fill per bucket
      const baseA = dark ? 0.22 : 0.13;
      const spanA = dark ? 0.6 : 0.5;
      for (let i = 0; i < BUCKETS; i++) {
        const path = bucketPaths[i];
        if (!path) continue;
        const e = (i + 0.5) / BUCKETS;
        ctx.fillStyle = `rgba(${dotRGB},${baseA + e * spanA})`;
        ctx.fill(path);
      }

      // link points that are lit up, so the field reads as a system
      if (near.length > 1) {
        ctx.lineWidth = 1;
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const a = near[i];
            const b = near[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < CFG.linkDist) {
              ctx.strokeStyle = `rgba(${dotRGB},${(
                (1 - d / CFG.linkDist) * (dark ? 0.34 : 0.22)
              ).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // expanding click rings
      for (let k = 0; k < ripples.length; k++) {
        const rp = ripples[k];
        const fade = Math.max(0, 1 - rp.r / (Math.hypot(w, h) * 0.75));
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, Math.max(0.1, rp.r), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${dotRGB},${(fade * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    build();
    start();

    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    // only animate while actually on screen
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onClick, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onClick);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [density, tone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
