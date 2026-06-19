import React from 'react';
import { motion } from 'framer-motion';
import { typography, products } from './tokens';
import ProductScreenshotShowcase from './ProductScreenshotShowcase';

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] rounded-full bg-gradient-to-r from-violet-700/10 via-blue-600/10 to-cyan-500/10 blur-3xl" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-violet-300/70 mb-3">
            Featured Product
          </div>
          <h2 className={`${typography.sectionHeading} text-white max-w-[640px]`}>
            The clinic{' '}
            <span className={typography.italicAccent}>operating system</span>{' '}
            for modern healthcare.
          </h2>
        </div>
        <div className="text-[13px] font-mono text-slate-400 md:text-right">
          MedQuePMS · medquepms.vellmontservices.com
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-hidden"
      >
        {/* Inner glow */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-0">
          {/* LEFT — product copy */}
          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white border border-white/15 flex items-center justify-center overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)]">
                <img
                  src="https://medquepms.vellmontservices.com/favicon-32.png"
                  alt="MedQuePMS"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <div className="text-[20px] font-display font-medium text-white tracking-tight leading-none">
                  MedQue<span className="text-teal-400">PMS</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  AI Clinic OS · India
                </div>
              </div>
              <div className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 ring-1 ring-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                Production Ready
              </div>
            </div>

            <p className="text-[15px] md:text-[16px] leading-[1.6] text-slate-300 mb-6 max-w-[520px]">
              AI-powered clinic operating system built for modern healthcare
              practices. Replaces the registers, missed calls, and scattered
              tools that a clinic actually runs on.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-7 max-w-[540px]">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] ring-1 ring-white/10 text-slate-300 font-mono"
                >
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://medquepms.vellmontservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 hover:from-violet-400 hover:to-cyan-400 transition-all shadow-[0_8px_24px_-6px_rgba(124,58,237,0.55)]"
              >
                <span>Visit Product</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#contact"
                className="group px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
              >
                <span>Request Demo</span>
                <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT — real product screenshots, auto-cycling */}
          <div className="relative bg-gradient-to-br from-[#0a0a1e] to-[#050816] p-6 md:p-8 lg:p-10 border-t md:border-t-0 md:border-l border-white/[0.06]">
            <ProductScreenshotShowcase
              desktops={flagship?.screenshots?.desktops || []}
              mobiles={flagship?.screenshots?.mobiles || []}
              urlbar="app.medquepms.com / Today's Clinic"
              interval={5500}
            />

            {/* footer metrics — kept under the device frames */}
            <div className="grid grid-cols-3 gap-2 mt-6 md:mt-8">
              {[
                { v: '37%', l: 'avg wait drop' },
                { v: '4.6×', l: 'missed-call recovery' },
                { v: '< 60s', l: 'patient registration' },
              ].map((m) => (
                <div
                  key={m.l}
                  className="rounded-md bg-white/[0.03] ring-1 ring-white/[0.08] px-3 py-2.5"
                >
                  <div className="text-[14px] font-display font-medium text-white tracking-tight">
                    {m.v}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
