import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

export function Thesis() {
  return (
    <section id="thesis" className="px-5 md:px-10 lg:px-20 py-8 md:py-12">
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          ── THE THESIS ─────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          01/04 ──
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8"
      >
        <div className="text-[17px] leading-[1.55] text-neutral-200">
          Big SaaS chases the{' '}
          <span className="text-neutral-500">Fortune 500.</span>
          <br />
          Indian SaaS chases the{' '}
          <span className="text-neutral-500">unicorn label.</span>
          <br />
          We build for the{' '}
          <span className="font-medium text-white">tour operator running on spreadsheets</span>
          , the{' '}
          <span className="font-medium text-white">astrologer taking bookings via DM</span>
          , and the{' '}
          <span className="font-medium text-white">tutor chasing fees on Paytm</span> — the
          long tail nobody else is shipping for.
        </div>
        <div className="text-[14px] leading-[1.7] text-neutral-400">
          They don't need AI as a slogan. They need AI that books the next
          patient, drafts a GST invoice, and chases a fee while they sleep —
          running on a ₹8,000 phone, paid by UPI, in Hindi when needed. That's
          the bar.
        </div>
      </motion.div>
    </section>
  );
}

const processSteps = [
  {
    n: '01',
    title: 'Argue with you',
    body: 'Until the brief is sharp enough to cut something.',
  },
  {
    n: '02',
    title: 'Build the ugly version',
    body: "Working beats pretty. Always. We'll prettify after.",
  },
  {
    n: '03',
    title: 'Ship in weeks',
    body: 'Not quarters. Not "Q3 roadmap." Weeks.',
  },
  {
    n: '04',
    title: 'Stick around',
    body: "We don't build and ghost. We keep iterating with you.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-5 md:px-10 lg:px-20 py-8 md:py-12">
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          ── HOW WE WORK ────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          03/04 ──
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10"
      >
        {processSteps.map((s) => (
          <div key={s.n} className="bg-[#0d0d18] p-5">
            <div className="font-mono text-2xl font-medium mb-2 bg-gradient-to-br from-indigo-300 to-emerald-300 bg-clip-text text-transparent">
              {s.n}
            </div>
            <div className="text-[13px] font-medium mb-1 text-white">
              {s.title}
            </div>
            <div className="text-[12px] text-neutral-400 leading-[1.5]">
              {s.body}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export function Endgame() {
  return (
    <section
      id="contact"
      className="px-5 md:px-10 lg:px-20 py-8 md:py-14"
    >
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          ── ENDGAME ────────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          04/04 ──
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:justify-between md:items-center gap-5 overflow-hidden"
      >
        {/* Soft brand-color glow inside the card */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-500/15 to-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-[420px]">
          <div className={`${typography.sectionHeading} mb-2 leading-[1.1] text-white`}>
            Got something{' '}
            <span className={`${typography.italicAccent} text-indigo-300`}>half-formed</span> in a
            Notion doc?
          </div>
          <div className="text-[13px] text-neutral-400 leading-[1.55]">
            Send it. We'll read it. We reply with a real plan, or an honest
            "we're not the right team."
          </div>
        </div>
        <a
          href="mailto:support@vellmontservices.com"
          className="relative bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-5 py-3.5 rounded-lg text-[14px] font-medium hover:from-indigo-400 hover:to-violet-500 transition-colors whitespace-nowrap shadow-[0_8px_24px_-6px_rgba(99,102,241,0.55)]"
        >
          support@vellmontservices.com →
        </a>
      </motion.div>
    </section>
  );
}
