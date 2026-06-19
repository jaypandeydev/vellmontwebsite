import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';
import NeuralNetwork from './NeuralNetwork';

const metrics = [
  { value: '6', label: 'Products Shipped' },
  { value: 'AI-First', label: 'Architecture' },
  { value: 'IN · AE', label: 'India + UAE Focus' },
  { value: '100%', label: 'Bootstrapped' },
];

export default function Hero() {
  return (
    <section className="relative px-5 md:px-10 lg:px-20 pt-14 md:pt-20 pb-12 md:pb-20 overflow-hidden">
      {/* Aurora glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[820px] h-[820px] rounded-full bg-gradient-to-br from-violet-600/30 via-fuchsia-600/15 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-48 w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full bg-gradient-to-t from-violet-700/15 to-transparent blur-3xl" />
        {/* Animated grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
        {/* Subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[12px] font-mono uppercase tracking-wider text-slate-300 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="text-emerald-300">Taking new projects</span>
          <span className="text-slate-500">·</span>
          <span>EST. 2025</span>
          <span className="text-slate-500">·</span>
          <span>Hyderabad · Dubai</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
          <div>
            <h1
              className={`${typography.displayHeadline} max-w-[720px] mb-6 text-white`}
            >
              AI Operating Systems
              <br className="hidden sm:inline" />{' '}
              For{' '}
              <span className={typography.italicAccent}>Real Businesses</span>
              .
            </h1>

            <p className={`${typography.bodyLg} max-w-[600px] mb-9`}>
              We build production-grade SaaS products that automate healthcare,
              tourism, education and business operations across India, UAE and
              global markets.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#products"
                className="group bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-6 py-3.5 rounded-lg text-[14px] font-medium flex items-center gap-2 hover:from-violet-400 hover:to-cyan-400 transition-all shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] hover:shadow-[0_14px_40px_-8px_rgba(124,58,237,0.8)]"
              >
                <span>Explore Products</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#contact"
                className="group px-6 py-3.5 rounded-lg text-[14px] font-medium flex items-center gap-2 text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors backdrop-blur-sm"
              >
                <span>Book Demo</span>
                <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/10 max-w-[640px]">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-[#070716]/80 backdrop-blur-sm px-4 py-4"
                >
                  <div className="text-[18px] md:text-[20px] font-display font-medium text-white tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <NeuralNetwork />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
