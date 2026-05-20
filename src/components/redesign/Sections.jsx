import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

export function Thesis() {
  return (
    <section id="thesis" className="px-5 md:px-10 lg:px-20 py-6 md:py-8">
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          ── THE THESIS ─────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
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
        <div className="text-[17px] leading-[1.55] text-neutral-900">
          Big SaaS chases the{' '}
          <span className="text-neutral-400">Fortune 500.</span>
          <br />
          Indian SaaS chases the{' '}
          <span className="text-neutral-400">unicorn label.</span>
          <br />
          We build for the{' '}
          <span className="font-medium">tour operator running on spreadsheets</span>
          , the{' '}
          <span className="font-medium">astrologer taking bookings via DM</span>
          , and the{' '}
          <span className="font-medium">tutor chasing fees on Paytm</span> — the
          long tail nobody else is shipping for.
        </div>
        <div className="text-[14px] leading-[1.7] text-neutral-600">
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
    <section id="process" className="px-5 md:px-10 lg:px-20 py-6 md:py-8">
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          ── HOW WE WORK ────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          03/04 ──
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-px bg-neutral-200 rounded-lg overflow-hidden border border-neutral-200"
      >
        {processSteps.map((s) => (
          <div key={s.n} className="bg-white p-5">
            <div className="font-mono text-2xl font-medium mb-2 text-neutral-900">
              {s.n}
            </div>
            <div className="text-[13px] font-medium mb-1 text-neutral-900">
              {s.title}
            </div>
            <div className="text-[12px] text-neutral-600 leading-[1.5]">
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
      className="px-5 md:px-10 lg:px-20 py-6 md:py-10"
    >
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          ── ENDGAME ────────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          04/04 ──
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-neutral-50 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:justify-between md:items-center gap-5"
      >
        <div className="max-w-[420px]">
          <div className={`${typography.sectionHeading} mb-2 leading-[1.1] text-neutral-900`}>
            Got something{' '}
            <span className={typography.italicAccent}>half-formed</span> in a
            Notion doc?
          </div>
          <div className="text-[13px] text-neutral-600 leading-[1.55]">
            Send it. We'll read it. We reply with a real plan, or an honest
            "we're not the right team."
          </div>
        </div>
        <a
          href="mailto:support@vellmontservices.com"
          className="bg-neutral-900 text-white px-5 py-3.5 rounded-lg text-[14px] font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          support@vellmontservices.com →
        </a>
      </motion.div>
    </section>
  );
}
