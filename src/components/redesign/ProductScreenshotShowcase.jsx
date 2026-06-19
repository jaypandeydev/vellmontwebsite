import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Animated product screenshot showcase.
 *
 * Renders a tilted browser frame containing a desktop screenshot that
 * auto-crossfades between images, with a floating iPhone-style phone frame
 * in the bottom-right corner doing the same with mobile screenshots.
 *
 * Data shape:
 *   <ProductScreenshotShowcase
 *     desktops={['/screenshots/<prod>/dash.png', ...]}
 *     mobiles={['/screenshots/<prod>/app.png', ...]}
 *     urlbar="medquepms.app / Dr. Rao · OPD-A"
 *   />
 *
 * Missing screenshots fall back to a styled empty tile so the layout never
 * breaks while you're still copying images in.
 */

function ImageWithFallback({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-violet-900/30 via-[#0a0a1e] to-cyan-900/20`}
      >
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
          screenshot pending
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}

export default function ProductScreenshotShowcase({
  desktops = [],
  mobiles = [],
  urlbar = 'app.example.com',
  interval = 5000,
}) {
  const [dIdx, setDIdx] = useState(0);
  const [mIdx, setMIdx] = useState(0);

  // Rotate desktop screenshots
  useEffect(() => {
    if (desktops.length < 2) return undefined;
    const t = setInterval(
      () => setDIdx((i) => (i + 1) % desktops.length),
      interval
    );
    return () => clearInterval(t);
  }, [desktops.length, interval]);

  // Rotate mobile screenshots — offset so they don't flip in unison
  useEffect(() => {
    if (mobiles.length < 2) return undefined;
    const t = setInterval(
      () => setMIdx((i) => (i + 1) % mobiles.length),
      Math.round(interval * 0.85)
    );
    return () => clearInterval(t);
  }, [mobiles.length, interval]);

  const currentDesktop = desktops[dIdx] || null;
  const currentMobile = mobiles[mIdx] || null;

  return (
    <div className="relative w-full pr-2 pb-10 md:pb-14">
      {/* Spotlight glow behind the device frames */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-cyan-500/15 blur-3xl" />
      </div>

      {/* Browser frame */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ transform: 'perspective(1400px) rotateY(-3deg) rotateX(2deg)' }}
        className="relative rounded-xl bg-[#080814] border border-white/[0.1] overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)]"
      >
        {/* chrome */}
        <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center gap-2 bg-[#0a0a18]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <div className="ml-3 flex-1 min-w-0 max-w-[460px] rounded-md bg-white/[0.04] ring-1 ring-white/[0.06] px-3 py-1 text-[10.5px] font-mono text-slate-400 truncate flex items-center gap-2">
            <span className="text-slate-500">🔒</span>
            {urlbar}
          </div>
          <div className="ml-2 inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            LIVE
          </div>
        </div>

        {/* desktop screenshot */}
        <div className="relative aspect-[16/9.5] bg-[#0a0a1e] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDesktop || 'empty-d'}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={currentDesktop}
                alt="Product screenshot"
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>
          {/* Inner top vignette for that 'screen' feeling */}
          <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Floating phone */}
      <motion.div
        initial={{ opacity: 0, y: 24, x: 12 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        className="absolute -bottom-2 right-0 sm:-right-3 md:-right-6 w-[120px] sm:w-[140px] md:w-[170px]"
        style={{ transform: 'perspective(1400px) rotateY(4deg) rotateX(-1deg)' }}
      >
        <div className="rounded-[28px] bg-black border border-white/15 p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
          <div className="relative rounded-[22px] overflow-hidden aspect-[9/19.5] bg-[#0a0a1e]">
            {/* notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42%] h-[6%] bg-black rounded-b-2xl z-10" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMobile || 'empty-m'}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <ImageWithFallback
                  src={currentMobile}
                  alt="Mobile app screenshot"
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Pagination dots */}
      {(desktops.length > 1 || mobiles.length > 1) && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
          {desktops.map((_, i) => (
            <span
              key={`d-${i}`}
              className={`h-1 rounded-full transition-all ${
                i === dIdx
                  ? 'w-4 bg-violet-300'
                  : 'w-1 bg-white/15'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
