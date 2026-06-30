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
  invitesync: {
    label: 'invitesync',
    render: () => (
      <>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          calendar + family list
        </div>
        <div className="text-[13px] mb-3">
          "We have a wedding invite next Friday. Remind my family and track RSVP."
        </div>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          invitesync →
        </div>
        <div className="text-[12px] leading-[1.6]">
          Event saved · RSVP group created · 3 reminders scheduled · Google
          Calendar synced.{' '}
          <span className="opacity-60">Auntie needs pickup? Add task.</span>
        </div>
      </>
    ),
    prompts: ['RSVP reminders', 'Family sharing', 'Event tasks'],
  },
  vellbill: {
    label: 'vellbill',
    render: () => (
      <>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          freelancer → invoice
        </div>
        <div className="text-[13px] mb-3">
          "Create GST invoice from this WhatsApp order and send a payment link."
        </div>
        <div className="font-mono text-[10px] opacity-50 mb-1.5">
          vellbill →
        </div>
        <div className="text-[12px] leading-[1.6]">
          Invoice #VB-1042 drafted · GST calculated · UPI link attached · due
          reminder set for 7 days.{' '}
          <span className="opacity-60">PDF and client ledger updated.</span>
        </div>
      </>
    ),
    prompts: ['GST invoice', 'Payment follow-up', 'Expense summary'],
  },
};

export default function AIDemoBlock() {
  const [active, setActive] = useState('medquepms');
  const current = demos[active];

  return (
    <section id="ai-flows" className="px-5 md:px-10 lg:px-20 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-[#080b16] p-5 text-white shadow-[0_24px_80px_-55px_rgba(0,0,0,0.95)] md:p-7"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <div className="font-mono text-[11px] mb-1.5 flex items-center gap-2 text-cyan-200/80 uppercase tracking-[0.22em]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
              AI workflow console
            </div>
            <div className="max-w-[680px] text-[20px] font-medium leading-[1.35] md:text-[24px]">
              Product intelligence shown as completed work, not as a generic assistant.
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {Object.keys(demos).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`rounded-md px-3 py-1 text-[11px] font-mono transition-all ${
                  active === key
                    ? 'bg-white text-[#07111f]'
                    : 'bg-white/[0.025] text-white/55 ring-1 ring-white/10 hover:text-white/85 hover:ring-white/20'
                }`}
              >
                {demos[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[128px] rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
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
              className="cursor-pointer rounded border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[11px] text-slate-300 transition-colors hover:border-cyan-200/30 hover:text-white"
            >
              {p}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
