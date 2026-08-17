import React from 'react';
import { motion } from 'framer-motion';
import { typography, products } from './tokens';
import ProductScreenshotShowcase from './ProductScreenshotShowcase';
import { CountUp } from './interactions';
import Flag from './Flag';

const flagship = products.find((p) => p.id === 'medquepms');

const FEATURES = [
  'Queue Management',
  'Appointment Booking',
  'WhatsApp Booking',
  'IVR Booking',
  'Patient Mobile App',
  'Nurse Mobile App',
  'Doctor Workspace',
  'Clinical Pre-Read',
  'AI Notes',
  'Billing',
  'Pharmacy Management',
  'Lab Integration',
  'Telemedicine',
  'Prescription Management',
  'Patient History Timeline',
  'Analytics Dashboard',
  'Role Based Access',
  'DLT SMS Integration',
  'Payment Gateway Integration',
];

export default function FeaturedShowcase() {
  return (
    <section className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24 overflow-hidden">
      {/* Section ambience */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] rounded-full bg-gradient-to-r from-violet-700/10 via-blue-600/10 to-brand-500/10 blur-3xl" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-violet-700/70 dark:text-violet-300/70 mb-3">
            Featured Product
          </div>
          <h2 className={`${typography.sectionHeading} text-ink max-w-[640px]`}>
            The clinic{' '}
            <span className={typography.italicAccent}>operating system</span>{' '}
            for modern healthcare.
          </h2>
        </div>
        <div className="text-[13px] font-mono text-ink-3 md:text-right">
          MedQuePMS · medquepms.vellmontservices.com
        </div>
      </div>

      <motion.div data-anim className="relative rounded-3xl bg-surface border border-line backdrop-blur-sm overflow-hidden"
      >
        {/* Inner glow */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-0">
          {/* LEFT, product copy */}
          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)]">
                <img
                  src="https://medquepms.vellmontservices.com/favicon-32.png"
                  alt="MedQuePMS"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <div className="text-[20px] font-display font-medium text-ink tracking-tight leading-none">
                  MedQue<span className="text-teal-600 dark:text-teal-400">PMS</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-ink-3">
                  <span>AI Clinic OS ·</span>
                  <Flag code="in" label="India" size="text-[12px]" />
                </div>
              </div>
              <div className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                Production Ready
              </div>
            </div>

            <p className="text-[15px] md:text-[16px] leading-[1.6] text-ink-2 mb-6 max-w-[520px]">
              AI-powered clinic operating system built for modern healthcare
              practices. Replaces the registers, missed calls, and scattered
              tools that a clinic actually runs on.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-7 max-w-[540px]">
              {FEATURES.slice(0, 6).map((f) => (
                <span
                  key={f}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-surface ring-1 ring-line text-ink-2 font-mono"
                >
                  {f}
                </span>
              ))}
              <a
                href="https://medquepms.vellmontservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] px-2.5 py-1 rounded-md bg-brand-500/10 ring-1 ring-brand-500/25 text-brand-600 dark:text-brand-400 font-mono hover:bg-brand-500/20 transition-colors"
              >
                +{FEATURES.length - 6} more
              </a>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://medquepms.vellmontservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="u-press group bg-brand-500 text-white px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 hover:bg-brand-600 transition-colors shadow-[0_8px_24px_-6px_rgba(88,72,248,0.5)]"
              >
                <span>Visit MedQuePMS</span>
                <span className="transition-transform group-hover:translate-x-0.5">↗</span>
              </a>
              <a
                href="https://calendly.com/finance-vellmontservices/" target="_blank" rel="noopener noreferrer"
                className="group px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 text-ink border border-line hover:border-line-strong hover:bg-surface-2 transition-colors"
              >
                <span>Book a demo</span>
                <span className="text-ink-3 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>

            {/* Outcomes sit with the pitch, not orphaned under the screenshot. */}
            <div className="mt-8 border-t border-line pt-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-3">
                Measured across pilot clinics
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: '37%', l: 'avg wait drop' },
                  { v: '4.6×', l: 'missed-call recovery' },
                  { v: '<60s', l: 'patient registration' },
                ].map((m) => (
                  <div key={m.l}>
                    <div className="font-display text-[22px] md:text-[26px] font-semibold tracking-tight text-ink">
                      <CountUp value={m.v} />
                    </div>
                    <div className="mt-0.5 text-[11px] font-mono leading-[1.4] text-ink-3">
                      {m.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT, real product screenshots on a tinted panel so the imagery
              reads as a screen rather than floating in white. */}
          <div className="relative flex items-center border-t border-line bg-gradient-to-br from-canvas-2 via-surface-tint to-canvas-2 p-6 md:border-l md:border-t-0 md:p-8 lg:p-10 dark:from-[#0e1122] dark:via-[#12142a] dark:to-[#0e1122]">
            <ProductScreenshotShowcase
              desktops={flagship?.screenshots?.desktops || []}
              mobiles={flagship?.screenshots?.mobiles || []}
              urlbar="app.medquepms.com / Today's Clinic"
              interval={5500}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
