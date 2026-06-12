import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const demos = {
  medquepms: {
    label: 'medquepms',
    render: () => (
      <>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          patient → whatsapp
        </div>
        <div className="text-[13px] mb-3">
          "Book me with Dr. Rao tomorrow morning"
        </div>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          medquepms →
        </div>
        <div className="text-[12px] leading-[1.6]">
          Slot at 10:40 AM · Token A-118 · ₹500 paid via UPI · Confirmation
          sent.{' '}
          <span className="opacity-60">Reschedule? Reply 1.</span>
        </div>
      </>
    ),
    prompts: ['Pharmacy CRM demo', 'IVR booking flow', 'Doctor dashboard'],
  },
  vedjyotix: {
    label: 'vedjyotix',
    render: () => (
      <>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          gun milan check
        </div>
        <div className="text-[12px] leading-[1.6] mb-2.5">
          Compatibility: <span className="font-medium">28 / 36 guna</span> ·
          Strong match. Mangal dosha: neutral.{' '}
          <span className="opacity-60">
            Want a detailed reading? Pandit Sharma is online — ₹299 / 15 min.
          </span>
        </div>
        <div className="flex gap-1.5">
          <span className="bg-white/10 px-2.5 py-1 rounded text-[11px]">
            Call
          </span>
          <span className="bg-white/10 px-2.5 py-1 rounded text-[11px]">
            Chat
          </span>
        </div>
      </>
    ),
    prompts: ['Daily horoscope', 'Numerology check', 'Find astrologer'],
  },
  vellroute: {
    label: 'vellroute',
    render: () => (
      <>
        <div className="font-mono text-[10px] opacity-50 mb-2">
          jaipur · 6 day tour · 4 pax
        </div>
        <div className="flex flex-col gap-1 text-[12px]">
          <div className="flex justify-between">
            <span>Hotel · Taj Rambagh</span>
            <span className="text-emerald-400">confirmed</span>
          </div>
          <div className="flex justify-between opacity-70">
            <span>Driver · Ramesh K.</span>
            <span>en route</span>
          </div>
          <div className="flex justify-between opacity-70">
            <span>Day 3 · Amber Fort</span>
            <span>guide assigned</span>
          </div>
        </div>
        <div className="mt-2 text-[11px] opacity-60">
          Itinerary auto-shared with tourists in 3 languages.
        </div>
      </>
    ),
    prompts: ['Multi-city itinerary', 'Driver tracking', 'Hotel inventory'],
  },
  tutora: {
    label: 'tutora',
    render: () => (
      <>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          parent → app
        </div>
        <div className="text-[13px] mb-3">
          "Need a CBSE class XII physics tutor — Saturday evenings."
        </div>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          tutora →
        </div>
        <div className="text-[12px] leading-[1.6] mb-2.5">
          Mr. Mehra · 4.8★ · Wave Optics · Sat 7:00 PM · ₹400 / 90 min ·
          UPI paid · class link sent.{' '}
          <span className="opacity-60">Recording shared after class.</span>
        </div>
        <div className="flex gap-1.5">
          <span className="bg-white/10 px-2.5 py-1 rounded text-[11px]">
            Join class
          </span>
          <span className="bg-white/10 px-2.5 py-1 rounded text-[11px]">
            Reschedule
          </span>
        </div>
      </>
    ),
    prompts: ['Tutor onboarding', 'Class scheduling', 'Fee tracking'],
  },
};

export default function AIDemoBlock() {
  const [active, setActive] = useState('medquepms');
  const current = demos[active];

  return (
    <section className="px-5 md:px-10 lg:px-20 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-[#0f0f1c] text-white rounded-2xl p-6 md:p-7 overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.5)]"
      >
        {/* Brand-gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent" />
        <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
        {/* Subtle radial glow inside */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-500/15 to-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <div className="font-mono text-[11px] mb-1.5 flex items-center gap-2 text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              {'// PICK A PRODUCT — POKE AROUND'}
            </div>
            <div className="text-[17px] font-medium">
              Six shipped products. None of them are decks.
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {Object.keys(demos).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                  active === key
                    ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-transparent text-white/55 hover:text-white/85 ring-1 ring-white/10 hover:ring-white/20'
                }`}
              >
                {demos[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3.5 min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {current.render()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {current.prompts.map((p) => (
            <span
              key={p}
              className="bg-indigo-500/10 ring-1 ring-indigo-500/25 text-indigo-200 px-2.5 py-1 rounded-full text-[11px] cursor-pointer hover:bg-indigo-500/20 hover:ring-indigo-500/40 transition-colors"
            >
              {p}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
