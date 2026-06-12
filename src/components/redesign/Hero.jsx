import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';
import NeuralNetwork from './NeuralNetwork';

export default function Hero() {
  return (
    <section className="relative px-5 md:px-10 lg:px-20 pt-10 md:pt-16 pb-12 overflow-hidden">
      {/* Atmospheric brand-color glows on the dark canvas */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-indigo-600/25 via-violet-600/15 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-transparent to-indigo-500/10 blur-3xl" />
        {/* Faint grid mask for that 'AI lab' texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          <span>EST. 2025</span>
          <span>HYDERABAD · DUBAI</span>
          <span>6 PRODUCTS SHIPPED</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            TAKING NEW PROJECTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-10 md:gap-12 items-center">
          <div>
            <h1
              className={`${typography.displayHeadline} max-w-[560px] mb-5 text-white`}
            >
              Software for the industries that{' '}
              <span className={`${typography.italicAccent} text-indigo-300`}>
                still run
              </span>{' '}
              on humans. We rewire them with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                AI
              </span>
              .
            </h1>

            <p className="text-[15px] leading-[1.65] text-neutral-400 max-w-[520px] mb-7">
              Tour operators with spreadsheets. Astrologers taking bookings via
              DM. Tutors chasing fees on Paytm. Doctors managing queues with
              paper tokens. We build the proper AI-powered software they
              should've had — and custom systems for everyone else.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a
                href="#contact"
                className="group bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 hover:from-indigo-400 hover:to-violet-500 transition-all shadow-[0_8px_24px_-6px_rgba(99,102,241,0.55)] hover:shadow-[0_10px_30px_-6px_rgba(99,102,241,0.75)]"
              >
                <span>Hire us to build</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#products"
                className="group px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 text-neutral-200 border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
              >
                <span>Try a product</span>
                <span className="text-neutral-500 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
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
