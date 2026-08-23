import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

const CALENDLY_URL = 'https://calendly.com/finance-vellmontservices/';

// =============================================================================
// THE VELLMONT VIEW — dark navy tri-column magazine block
// =============================================================================
const viewCards = [
  {
    n: '01',
    title: 'Start with the shift',
    body:
      'We spend time where the work happens: at the desk, on the phone, in the queue, and between handoffs.',
  },
  {
    n: '02',
    title: 'Make the next step obvious',
    body:
      'Good software lowers the number of things an operator has to remember. Clarity is a feature.',
  },
  {
    n: '03',
    title: 'Ship the useful version',
    body:
      "We build in small, testable releases that earn their place in a real team's day.",
  },
];

export function Thesis() {
  return (
    <div className="px-5 md:px-10 lg:px-14 my-4 md:my-8">
      <section
        id="vellmont-view"
        className="relative mx-auto max-w-[1320px] rounded-3xl bg-[#25204E] text-white px-6 md:px-12 lg:px-16 py-8 md:py-12 overflow-hidden"
      >
        <div className="mx-auto max-w-[1220px]">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-6 h-px bg-[#E8B99A]" />
          <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-[#E8B99A]">
            The Vellmont view
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr_1fr_1fr] gap-8 md:gap-10 items-start">
          <div>
            <h2 className={`${typography.sectionHeading} text-white`}>
              The best software respects the day it{' '}
              <span className="text-[#E8B99A] italic">enters</span>
              <span className="text-white">.</span>
            </h2>
          </div>

          {viewCards.map((card, i) => (
            <motion.div
              key={card.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="pt-3 border-t border-white/15"
            >
              <div className="font-display text-[15px] text-[#E8B99A] mb-6">{card.n}</div>
              <div className="font-display text-[22px] leading-[1.15] text-white mb-3">
                {card.title}
              </div>
              <div className="text-[14px] leading-[1.55] text-white/70">
                {card.body}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// SERVICES — Sometimes the product is only half the job
// =============================================================================
const engagementSteps = [
  { n: '1', title: 'Listen', body: 'Map the real work' },
  { n: '2', title: 'Shape', body: 'Choose what matters now' },
  { n: '3', title: 'Build', body: 'Ship a dependable first cut' },
  { n: '4', title: 'Stay close', body: 'Learn, tune, and support' },
];

export function Services() {
  const [activeIdx, setActiveIdx] = useState(2);

  return (
    <div className="px-5 md:px-10 lg:px-14 my-8 md:my-10">
      <section
        id="services"
        className="mx-auto max-w-[1320px] rounded-3xl bg-[#EEE7F5] px-6 md:px-12 lg:px-16 py-10 md:py-14"
      >
        <div className="mx-auto max-w-[1220px] grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-[#5848F8]" />
            <span className={typography.eyebrow}>Software + services</span>
          </div>
          <h2 className={`${typography.sectionHeading} text-[#1E1A3D] max-w-[540px]`}>
            Sometimes the product is only{' '}
            <span className={typography.italicAccent}>half the job</span>
            <span className="text-[#1E1A3D]">.</span>
          </h2>
          <p className={`${typography.bodyLg} mt-6 max-w-[500px]`}>
            We can help you find the shape of the problem, build the first useful
            version, and stay close while it becomes part of the operation.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[#5848F8] font-medium text-[14px] hover:text-[#3B2AD6] transition-colors"
          >
            Talk through a project <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Engagement card */}
        <div className="relative rounded-2xl bg-white border border-[rgba(30,26,61,0.08)] p-6 md:p-8 shadow-[0_30px_60px_-30px_rgba(30,26,61,0.25)]">
          <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-[10px] border-[#E8B99A] border-l-transparent border-b-transparent pointer-events-none" />

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8F8AA0] mb-6">
            A typical Vellmont engagement
          </div>

          <ul className="space-y-4">
            {engagementSteps.map((s, i) => {
              const isActive = i === activeIdx;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className="w-full grid grid-cols-[36px_1fr_auto_auto] items-center gap-4 text-left py-3 border-b border-[rgba(30,26,61,0.08)] last:border-b-0 group"
                  >
                    <span
                      className={`w-8 h-8 rounded-full grid place-items-center text-[13px] font-display font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#5848F8] text-white'
                          : 'bg-[rgba(88,72,248,0.1)] text-[#5848F8] group-hover:bg-[rgba(88,72,248,0.18)]'
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className="text-[15px] font-semibold text-[#1E1A3D]">
                      {s.title}
                    </span>
                    <span className="text-[13px] text-[#6B667E]">{s.body}</span>
                    <span className="text-[#8F8AA0] text-[16px] leading-none">+</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// WHY VELLMONT — Small enough to notice + two accent cards
// =============================================================================
export function WhyVellmont() {
  return (
    <section
      id="how-we-work"
      className="mx-auto max-w-[1320px] px-5 md:px-10 lg:px-14 py-10 md:py-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr] gap-8 md:gap-10 items-start">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-[#5848F8]" />
            <span className={typography.eyebrow}>Why Vellmont</span>
          </div>
          <h2 className={`${typography.sectionHeading} text-[#1E1A3D] max-w-[560px]`}>
            Small enough to notice.<br />
            Serious enough to ship.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-[#E8B99A] p-7 md:p-8 min-h-[240px] flex flex-col justify-between"
        >
          <div>
            <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-[#3E1E0A]/10 text-[#4A2A0E] text-[14px] leading-none">
              ⏱
            </span>
            <div className="mt-6 font-display text-[28px] leading-[1.05] text-[#3E1E0A]">
              Close loops
            </div>
          </div>
          <p className="text-[14px] leading-[1.55] text-[#3E1E0A]/80 mt-5">
            Fewer handoffs. Better decisions.<br />A team you can actually reach.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="rounded-2xl bg-[#D8E8DA] p-7 md:p-8 min-h-[240px] flex flex-col justify-between"
        >
          <div>
            <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-[#1F3B26]/10 text-[#1F3B26] text-[14px] leading-none">
              ⌘
            </span>
            <div className="mt-6 font-display text-[28px] leading-[1.05] text-[#1F3B26]">
              Wide context
            </div>
          </div>
          <p className="text-[14px] leading-[1.55] text-[#1F3B26]/80 mt-5">
            Experience across the systems<br />that make a business feel human.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// ENDGAME — Have a real problem? Purple block + Calendly + 3-flag phones.
// =============================================================================
export function Endgame() {
  return (
    <div className="px-5 md:px-10 lg:px-14 mb-16">
      <section
        id="contact"
        className="relative mx-auto max-w-[1320px] rounded-3xl bg-[#5848F8] text-white overflow-hidden"
      >
        <div className="relative px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-6 h-px bg-[#E8B99A]" />
          <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-[#E8B99A]">
            Have a real problem?
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-end">
          <h2 className={`${typography.sectionHeading} text-white max-w-[720px]`}>
            Let&rsquo;s make<br />
            <span className="text-[#E8B99A] italic">something useful</span>
            <span className="text-white">.</span>
          </h2>

          <div className="flex flex-col gap-6">
            <p className="text-[15px] md:text-[16px] leading-[1.55] text-white/85 max-w-[420px]">
              Tell us what is getting in the way. We&rsquo;ll bring questions, not a
              pitch deck.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-white text-[#5848F8] text-[15px] font-medium px-6 py-3.5 hover:bg-[#F5EFE7] transition-colors self-start"
              >
                <span>Book a demo</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="mailto:support@vellmontservices.com"
                className="text-[13.5px] text-white/85 hover:text-white transition-colors underline underline-offset-4 self-start"
              >
                support@vellmontservices.com
              </a>
            </div>
          </div>
        </div>

        {/* 3-flag phone strip — original data preserved */}
        <div className="mt-14 md:mt-16 pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-[13px]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
              Hyderabad
            </div>
            <div className="text-white flex items-center gap-2">
              <span aria-hidden="true">🇮🇳</span>
              <span>+91 7702216501</span>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
              Dubai
            </div>
            <div className="text-white flex items-center gap-2">
              <span aria-hidden="true">🇦🇪</span>
              <span>+971 547594261</span>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
              USA
            </div>
            <div className="text-white flex items-center gap-2">
              <span aria-hidden="true">🇺🇸</span>
              <span>+1 (813) 203-8044</span>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

// Kept as no-op alias so any legacy `<Process />` imports don't crash.
export const Process = () => null;
