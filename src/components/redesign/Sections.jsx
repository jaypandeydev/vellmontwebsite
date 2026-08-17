import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';
import { CopyButton, Spotlight } from './interactions';
import Flag from './Flag';
import AmbientField from './AmbientField';

export function Thesis() {
  return (
    <section
      id="thesis"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-600 dark:text-brand-400 mb-4">
        Why Vellmont Exists
      </div>
      <motion.div data-anim className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-10 md:gap-16 items-start"
      >
        <div>
          <h2
            className={`${typography.sectionHeading} text-ink mb-6 max-w-[680px]`}
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
          <div className="mt-8">
            <div className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-3">
              What we replace
            </div>
            <div className="flex flex-wrap gap-2">
              {['Spreadsheets', 'WhatsApp groups', 'Paper registers', 'Missed calls', 'Manual follow-up', 'Scattered tools'].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line bg-surface px-2.5 py-1 text-[12px] text-ink-3 line-through decoration-brand-400/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
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
            <Spotlight
              key={row.k}
              className="u-hover rounded-lg bg-surface border border-line p-5"
            >
              <div className="text-[15px] font-medium text-ink mb-1">
                {row.k}
              </div>
              <div className="text-[14px] text-ink-3 leading-[1.55]">
                {row.v}
              </div>
            </Spotlight>
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
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          ── HOW WE WORK ────────────
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          FOUR STEPS ──
        </div>
      </div>
      <motion.div data-anim className="grid grid-cols-1 md:grid-cols-4 gap-px bg-line rounded-lg overflow-hidden border border-line"
      >
        {processSteps.map((s) => (
          <div key={s.n} className="group bg-surface p-5 transition-colors hover:bg-surface-2">
            <div className="font-mono text-2xl font-medium mb-2 text-brand-600 dark:text-brand-400 transition-transform group-hover:-translate-y-0.5">
              {s.n}
            </div>
            <div className="text-[13px] font-medium mb-1 text-ink">
              {s.title}
            </div>
            <div className="text-[12px] text-ink-3 leading-[1.5]">
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
      <motion.div data-anim className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f22] p-6 sm:p-8 md:p-14 shadow-[0_50px_120px_-40px_rgba(24,20,70,0.55)]"
      >
        {/* Decorative brand glow */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(50%_60%_at_15%_0%,rgba(88,72,248,0.35),transparent_60%),radial-gradient(45%_60%_at_95%_100%,rgba(217,70,239,0.22),transparent_60%),radial-gradient(40%_50%_at_80%_0%,rgba(245,158,11,0.12),transparent_60%)]" />
        <AmbientField density={1.4} tone="dark" />
        {/* Colour sitting directly behind the glass panel. Blur needs something
            with scale to work on: 1px dots just vanish into an even wash, but a
            soft gradient bends into the frosted look we are after. It drifts, so
            what shows through the glass keeps changing. */}
        <div className="u-drift pointer-events-none absolute right-[2%] top-[6%] hidden h-[26rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(88,72,248,0.34),rgba(88,72,248,0)_72%)] md:block" />
        <div className="u-drift pointer-events-none absolute right-[24%] bottom-[2%] hidden h-[18rem] w-[22rem] rounded-full bg-[radial-gradient(closest-side,rgba(217,70,239,0.26),rgba(217,70,239,0)_72%)] [animation-delay:-11s] md:block" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(139,132,248,0.9)]" />
              Let's Talk
            </div>
            <div className={`${typography.sectionHeading} mb-4 text-white max-w-[520px] leading-[1.1]`}>
              Build your next{' '}
              <span className="bg-gradient-to-r from-brand-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                AI product
              </span>{' '}
              with Vellmont.
            </div>
            <div className="text-[17px] md:text-[18px] leading-[1.6] text-slate-300 max-w-[480px] mb-7">
              Bring us an operational business with messy workflows. We will
              shape it into a polished SaaS product with AI where it actually
              improves the work.
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://calendly.com/finance-vellmontservices/" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2 whitespace-nowrap rounded-md bg-brand-500 px-6 py-3.5 text-[14px] font-medium text-white shadow-[0_16px_40px_-12px_rgba(88,72,248,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_20px_50px_-12px_rgba(88,72,248,0.85)]"
              >
                <span>Book a demo</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="mailto:support@vellmontservices.com"
                className="group flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-[14px] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <span>Contact Sales</span>
                <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>

          {/* Frosted glass. The particle field and the drifting glows run behind
              it, so the blur has something to diffuse instead of sitting on a
              flat card. */}
          <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.06] p-6 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.75)] backdrop-blur-md backdrop-saturate-150">
            {/* Lit top edge, the tell that sells a pane of glass */}
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            {/* Faint sheen falling from the top-left corner */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%)]" />
            <div className="relative">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-3">
              Direct
            </div>
            <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href="mailto:support@vellmontservices.com"
                className="u-link break-all text-[14px] sm:text-[18px] font-medium text-white hover:text-brand-300 transition-colors"
              >
                support@vellmontservices.com
              </a>
              <CopyButton
                text="support@vellmontservices.com"
                className="border border-white/15 text-slate-300 hover:border-white/30 hover:text-white"
              />
            </div>
            <div className="text-[12px] font-mono text-slate-300 mb-6">
              Replies within 1 business day
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
              <div>
                <div className="font-mono text-slate-300 uppercase tracking-wider mb-1">
                  Hyderabad
                </div>
                <div className="text-slate-300">
                  <Flag code="in" label="+91 7702216501" size="text-[13px]" />
                </div>
              </div>
              <div>
                <div className="font-mono text-slate-300 uppercase tracking-wider mb-1">
                  Dubai
                </div>
                <div className="text-slate-300">
                  <Flag code="ae" label="+971 547594261" size="text-[13px]" />
                </div>
              </div>
              <div>
                <div className="font-mono text-slate-300 uppercase tracking-wider mb-1">
                  USA
                </div>
                <div className="text-slate-300">
                  <Flag code="us" label="+1 (813) 203-8044" size="text-[13px]" />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
