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
  tourconnect: {
    label: 'tourconnect',
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
        className="bg-neutral-900 text-white rounded-2xl p-6 md:p-7"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <div className="font-mono text-[11px] opacity-50 mb-1.5">
              {'// PICK A PRODUCT — POKE AROUND'}
            </div>
            <div className="text-[17px] font-medium">
              Six live products. None of them are decks.
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {Object.keys(demos).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors ${
                  active === key
                    ? 'bg-white/15 text-white'
                    : 'bg-transparent text-white/60 hover:text-white/80'
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
              className="bg-white/10 px-2.5 py-1 rounded-full text-[11px] cursor-pointer hover:bg-white/15 transition-colors"
            >
              {p}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
