import React from 'react';
import { motion } from 'framer-motion';
import { typography } from './tokens';

const CALENDLY_URL = 'https://calendly.com/finance-vellmontservices/';

const industries = ['Healthcare', 'Travel', 'Finance', 'Education', 'Operations'];

const labNotes = [
  'Healthcare — clinic queues, WhatsApp bookings and AI pre-read',
  'Travel & tourism — tour CRM, vendors, payments and traveller portals',
  'Astrology — kundli, gun milan and a verified astrologer marketplace',
  'Billing & invoicing — GST invoices, quotations, expenses, recurring',
  'Events — invitations, RSVPs, reminders and calendar sync',
  'Visitor & gatepass — pre-approval, QR check-in and audit trails',
  'Tutoring — teacher profiles, bookings, video sessions and payments',
];

export default function Hero() {
  return (
    <section className="relative px-5 md:px-10 lg:px-14 pt-2 md:pt-4 pb-6 md:pb-8">
      <div className="mx-auto max-w-[1320px]">
        {/* Hero card — grid backdrop wraps only the headline block; meta strip
            lives outside on plain cream so it never crowds the border. */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl border border-[rgba(30,26,61,0.12)] pointer-events-none overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(30,26,61,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,26,61,0.08) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              backgroundPosition: '0 0',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative pt-10 md:pt-14 pb-12 md:pb-16 px-5 md:px-10 lg:px-14"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-7">
              <span className="w-6 h-px bg-[#5848F8]" />
              <span className={typography.eyebrow}>Premium product lab</span>
              <span className="text-[#B7B4C2]">·</span>
              <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-[#4B4762]">
                AI-native vertical SaaS
              </span>
              <span className="text-[#B7B4C2]">·</span>
              <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-[#4B4762]">
                Hyderabad + Dubai
              </span>
            </div>

            <h1 className="font-display font-normal tracking-[-0.02em] leading-[1.02] text-[40px] sm:text-[54px] md:text-[72px] lg:text-[92px] text-[#1E1A3D] max-w-[1180px]">
              AI software for{' '}
              <span className={typography.italicAccent}>
                healthcare, travel, astrology,
              </span>{' '}
              billing, events, access{' '}
              <span className="text-[#1E1A3D]">— and small businesses.</span>
            </h1>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-10 md:gap-14">
              <div>
                <p className={`${typography.bodyLg} max-w-[640px]`}>
                  Vellmont Services is an AI-powered SaaS company building enterprise
                  software across healthcare, logistics, finance, business automation,
                  and consumer AI. Our flagship platform, MedQuePMS, leads our
                  commercial expansion into healthcare.
                </p>

                <p className="mt-4 max-w-[640px] border-l-2 border-[#5848F8]/30 pl-4 text-[14px] md:text-[15px] leading-[1.65] text-[#6B667E]">
                  A wider portfolio of production-ready products across adjacent
                  verticals proves the product depth behind the company.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#5848F8] text-white text-[14px] font-medium px-6 py-3.5 hover:bg-[#4736E4] transition-colors shadow-[0_10px_30px_-12px_rgba(88,72,248,0.55)]"
                  >
                    <span>Book a demo</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                  <a
                    href="#portfolio"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(30,26,61,0.15)] text-[#1E1A3D] text-[14px] font-medium px-6 py-3.5 hover:bg-[rgba(30,26,61,0.04)] transition-colors"
                  >
                    <span>View products</span>
                    <span aria-hidden="true" className="text-[#8F8AA0]">→</span>
                  </a>
                </div>
              </div>

              <div>
                <div className={`${typography.monoLabel} mb-4`}>
                  What we ship
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-3">
                  {labNotes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-[#4B4762]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#5848F8] shrink-0"
                      />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Meta strip below the hero card — sits on plain cream, no border pressure. */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          <p className="max-w-[380px] text-[15px] leading-[1.55] text-[#4B4762]">
            One studio, a growing set of<br />
            products for work that deserves<br />
            better tools.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-end text-[13px] text-[#6B667E]">
            {industries.map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
