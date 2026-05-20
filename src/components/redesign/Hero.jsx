import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

export default function Hero() {
  return (
    <section className="px-5 md:px-10 lg:px-20 pt-8 md:pt-12 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          <span>EST. 2025</span>
          <span>HYDERABAD</span>
          <span>6 PRODUCTS LIVE</span>
          <span className="text-emerald-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            TAKING NEW PROJECTS
          </span>
        </div>

        <h1
          className={`${typography.displayHeadline} max-w-[640px] mb-6 text-neutral-900`}
        >
          Software for the industries that{' '}
          <span className={typography.italicAccent}>still run</span> on
          humans. We rewire them with AI.
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-[680px] mt-5">
          <p className="text-[15px] leading-[1.6] text-neutral-600 flex-1">
            Tour operators with spreadsheets. Astrologers taking bookings via
            DM. Tutors chasing fees on Paytm. Doctors managing queues with
            paper tokens. We build the proper software they should've had ten
            years ago — and we build custom systems for everyone else.
          </p>

          <div className="flex flex-col gap-2 md:min-w-[180px]">
            <a
              href="#contact"
              className="bg-neutral-900 text-white px-4 py-3 rounded-lg text-[13px] font-medium flex justify-between items-center hover:bg-neutral-800 transition-colors"
            >
              <span>Hire us to build</span>
              <span>→</span>
            </a>
            <a
              href="#products"
              className="px-4 py-3 rounded-lg text-[13px] flex justify-between items-center text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <span>Try a product</span>
              <span className="text-neutral-400">→</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
