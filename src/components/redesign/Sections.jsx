import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

export function Thesis() {
  return (
    <section
      id="thesis"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/80 mb-4">
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
            We turn operational businesses into{' '}
            <span className={typography.italicAccent}>software-first</span>{' '}
            companies.
          </h2>
          <p className={`${typography.bodyLg} max-w-[640px]`}>
            Clinics, tour operators, tutors, astrologers and small businesses
            still run on spreadsheets, WhatsApp groups and manual processes.
            Vellmont replaces that operational chaos with productized
            automation: production-grade SaaS, AI-first by default,
            built for the way these businesses actually work.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              k: 'Production-grade',
              v: 'Every product is designed around real roles, permissions, payments, notifications and daily operating screens.',
            },
            {
              k: 'AI-first by default',
              v: 'AI is wired into booking, billing, intake, analysis and follow-up instead of sitting outside the product.',
            },
            {
              k: 'Built for local reality',
              v: 'UPI, WhatsApp, IVR, GST, multilingual flows and UAE/India operating patterns are first-class design inputs.',
            },
          ].map((row) => (
            <div
              key={row.k}
              className="rounded-lg bg-white/[0.025] border border-white/[0.08] p-5"
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
    title: 'Map the operation',
    body: 'We model roles, workflows, edge cases and business rules before designing screens.',
  },
  {
    n: '02',
    title: 'Design the product system',
    body: 'Dashboards, mobile flows, notifications, AI steps and admin controls become one product surface.',
  },
  {
    n: '03',
    title: 'Ship production modules',
    body: 'Authentication, payments, reporting, integrations and support tooling ship with the core product.',
  },
  {
    n: '04',
    title: 'Operate and improve',
    body: 'Usage data, support requests and customer behavior feed the next product iteration.',
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
          <div key={s.n} className="bg-[#080b16] p-5">
            <div className="font-mono text-2xl font-medium mb-2 text-cyan-100">
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
        className="relative bg-[#080b16] border border-white/10 rounded-xl p-8 md:p-12 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/80 mb-4">
              Let's Talk
            </div>
            <div className={`${typography.sectionHeading} mb-4 text-white max-w-[520px] leading-[1.1]`}>
              Build your next{' '}
              <span className={typography.italicAccent}>AI product</span> with Vellmont.
            </div>
            <div className={`${typography.bodyLg} max-w-[480px] mb-6`}>
              Bring us an operational business with messy workflows. We will
              shape it into a polished SaaS product with AI where it actually
              improves the work.
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="group bg-white text-[#07111f] px-5 py-3.5 rounded-md text-[14px] font-medium flex items-center gap-2 hover:bg-cyan-100 transition-colors whitespace-nowrap"
              >
                <span>Book Discovery Call</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="mailto:support@vellmontservices.com"
                className="group px-5 py-3.5 rounded-md text-[14px] font-medium flex items-center gap-2 text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
              >
                <span>Contact Sales</span>
                <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.025] border border-white/[0.08] p-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">
              Direct
            </div>
            <a
              href="mailto:support@vellmontservices.com"
              className="block text-[18px] font-medium text-white hover:text-cyan-100 transition-colors mb-1"
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
