import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

export function Thesis() {
  return (
    <section
      id="thesis"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <div className="font-mono text-[11px] uppercase tracking-wider text-violet-300/70 mb-4">
        Why Vellmont Exists
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-10 md:gap-16 items-start"
      >
        <div>
          <h2
            className={`${typography.sectionHeading} text-white mb-6 max-w-[680px]`}
          >
            Most software is built for{' '}
            <span className={typography.italicAccent}>Fortune 500</span>{' '}
            companies. We build for everyone else.
          </h2>
          <p className={`${typography.bodyLg} max-w-[640px]`}>
            Clinics, tour operators, tutors, astrologers and small businesses
            still run on spreadsheets, WhatsApp groups and manual processes.
            Our mission is to replace operational chaos with intelligent
            automation — production-grade software, AI-first by default,
            built for the way these businesses actually work.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              k: 'Production-grade',
              v: 'No demos, no MVPs that crumble. Every product runs real workloads from day one.',
            },
            {
              k: 'AI-first by default',
              v: 'AI is wired into the workflow, not pinned to it. Booking, billing, intake, follow-up.',
            },
            {
              k: 'Built for the long tail',
              v: 'Rupee billing, UPI, WhatsApp, IVR, Hindi when needed. The local stack as a first principle.',
            },
          ].map((row) => (
            <div
              key={row.k}
              className="rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm p-5"
            >
              <div className="text-[15px] font-medium text-white mb-1">
                {row.k}
              </div>
              <div className="text-[14px] text-slate-400 leading-[1.55]">
                {row.v}
              </div>
            </div>
          ))}
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
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-10 md:p-14 overflow-hidden"
      >
        {/* Brand-color glow */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-500/25 via-fuchsia-500/12 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-500/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-violet-300/70 mb-4">
              Let's Talk
            </div>
            <div className={`${typography.sectionHeading} mb-4 text-white max-w-[520px] leading-[1.1]`}>
              Let's build something{' '}
              <span className={typography.italicAccent}>meaningful</span>.
            </div>
            <div className={`${typography.bodyLg} max-w-[480px] mb-6`}>
              Looking to digitize your business? Need AI automation? Want a
              custom SaaS product? Let's talk.
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="group bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-5 py-3.5 rounded-lg text-[14px] font-medium flex items-center gap-2 hover:from-violet-400 hover:to-cyan-400 transition-all shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] whitespace-nowrap"
              >
                <span>Book Discovery Call</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="mailto:support@vellmontservices.com"
                className="group px-5 py-3.5 rounded-lg text-[14px] font-medium flex items-center gap-2 text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
              >
                <span>Contact Sales</span>
                <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-[#070716]/60 border border-white/[0.08] p-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">
              Direct
            </div>
            <a
              href="mailto:support@vellmontservices.com"
              className="block text-[18px] font-medium text-white hover:text-violet-300 transition-colors mb-1"
            >
              support@vellmontservices.com
            </a>
            <div className="text-[12px] font-mono text-slate-500 mb-6">
              Replies within 1 business day
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <div className="font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Hyderabad
                </div>
                <div className="text-slate-300">+91 8143210000</div>
              </div>
              <div>
                <div className="font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Dubai
                </div>
                <div className="text-slate-300">+971 547594261</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
