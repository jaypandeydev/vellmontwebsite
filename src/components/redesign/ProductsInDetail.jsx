import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BrainCircuit, CheckCircle2, Workflow } from 'lucide-react';
import { products, colorCategories, typography } from './tokens';

/**
 * Premium SaaS-style product strips. One row per product (zig-zag layout):
 * marketing banner on one side, copy + features + CTA on the other.
 * Only renders products that have a `banner` set in tokens.js — the rest
 * stay in the compact Products grid below.
 */

const TONE_PILL = {
  healthcare: 'bg-teal-500/15 text-teal-300 ring-teal-500/30',
  astrology: 'bg-pink-500/15 text-pink-300 ring-pink-500/30',
  travel: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  education: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  social: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
  finance: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
};

const AI_FLOWS = {
  medquepms: {
    system: 'Clinic operating layer',
    outcome: 'Patient intake, queue, consultation, billing and follow-up run in one clinical workspace.',
    flows: ['AI clinical pre-read', 'WhatsApp/IVR booking', 'Follow-up recall', 'Smart patient history'],
  },
  vellroute: {
    system: 'Tour-operator command center',
    outcome: 'Leads, packages, vendors, bookings, payments and traveller communication stay synchronized.',
    flows: ['AI tourist onboarding', 'Itinerary automation', 'Vendor coordination', 'Multilingual travel comms'],
  },
  vedjyotix: {
    system: 'Astrology marketplace engine',
    outcome: 'AI reports and verified astrologer consultations combine into a full consumer product.',
    flows: ['AI kundli reports', 'Match insights', 'Consultation routing', 'Multilingual guidance'],
  },
  invitesync: {
    system: 'Invitation memory layer',
    outcome: 'Events, RSVPs, reminders, calendars and family sharing keep social commitments organized.',
    flows: ['Smart reminders', 'Event categorization', 'RSVP nudges', 'Calendar intelligence'],
  },
  vellbill: {
    system: 'SMB finance workspace',
    outcome: 'Invoices, GST, quotes, recurring billing, expenses and payment reminders stay audit-ready.',
    flows: ['Invoice drafting', 'GST-aware flows', 'Payment follow-up', 'Expense summaries'],
  },
  tutora: {
    system: 'Learning marketplace OS',
    outcome: 'Tutors, students, scheduling, video sessions, payments and feedback connect in one flow.',
    flows: ['Tutor matching', 'Schedule suggestions', 'Session summaries', 'Learning recommendations'],
  },
};

const CASE_STUDIES = {
  medquepms: {
    headline: 'Clinic command layer',
    status: 'OPD-A / live',
    metrics: [
      ['184', 'patients'],
      ['11m', 'wait'],
      ['47', 'WA bookings'],
    ],
    workflow: [
      ['Book', 'WhatsApp, IVR, app and front desk intake'],
      ['Prepare', 'AI pre-read summarizes history before consult'],
      ['Close', 'Billing, pharmacy and follow-up stay synced'],
    ],
    intelligence: 'AI reads patient context, flags risks and prepares the doctor workspace.',
    fabric: ['Queue', 'Consult', 'Pharmacy', 'Billing'],
  },
  vellroute: {
    headline: 'Tour operator cockpit',
    status: 'Dubai / Rajasthan',
    metrics: [
      ['42', 'leads'],
      ['18', 'bookings'],
      ['7', 'vendors'],
    ],
    workflow: [
      ['Capture', 'Leads from WhatsApp, agents and web enquiries'],
      ['Compose', 'AI turns preferences into itinerary drafts'],
      ['Operate', 'Hotels, drivers, vouchers and payments tracked'],
    ],
    intelligence: 'AI drafts itinerary options and keeps traveller communication multilingual.',
    fabric: ['CRM', 'Vendors', 'Payments', 'Portal'],
  },
  vedjyotix: {
    headline: 'Astrology marketplace engine',
    status: 'consumer / live',
    metrics: [
      ['28/36', 'match'],
      ['299', 'consult'],
      ['3', 'languages'],
    ],
    workflow: [
      ['Generate', 'Kundli, numerology and match reports'],
      ['Route', 'AI suggests relevant astrologer category'],
      ['Consult', 'Chat and call sessions convert reports into advice'],
    ],
    intelligence: 'AI reports create instant value while verified experts handle deeper guidance.',
    fabric: ['Kundli', 'Reports', 'Marketplace', 'Calls'],
  },
  invitesync: {
    headline: 'Invitation memory system',
    status: 'family / events',
    metrics: [
      ['86', 'contacts'],
      ['29', 'RSVPs'],
      ['4', 'reminders'],
    ],
    workflow: [
      ['Capture', 'Event details saved from invite context'],
      ['Coordinate', 'Family members, calendars and tasks linked'],
      ['Remind', 'Smart reminders prevent missed commitments'],
    ],
    intelligence: 'AI detects dates, venues and event intent so reminders are created automatically.',
    fabric: ['Events', 'RSVP', 'Calendar', 'Family'],
  },
  vellbill: {
    headline: 'SMB finance workspace',
    status: 'GST / live',
    metrics: [
      ['31', 'invoices'],
      ['12', 'due soon'],
      ['GST', 'ready'],
    ],
    workflow: [
      ['Draft', 'Quotes and invoices from client/order context'],
      ['Send', 'PDF, WhatsApp share and payment link generated'],
      ['Track', 'Expenses, dues and tax-ready reports stay current'],
    ],
    intelligence: 'AI reduces invoice creation and follow-up work while keeping GST context visible.',
    fabric: ['Invoices', 'Quotes', 'Expenses', 'Reports'],
  },
  tutora: {
    headline: 'Learning marketplace OS',
    status: 'beta / global',
    metrics: [
      ['4.8', 'rating'],
      ['7pm', 'slot'],
      ['90m', 'session'],
    ],
    workflow: [
      ['Match', 'Students find tutor fit by subject and schedule'],
      ['Book', 'Availability, payment and class link confirmed'],
      ['Improve', 'Ratings and session history improve discovery'],
    ],
    intelligence: 'AI can recommend tutors, schedules and learning next steps from student context.',
    fabric: ['Tutors', 'Booking', 'Video', 'Payments'],
  },
};

function CaseStudyMockup({ product, aiSpec }) {
  const study =
    CASE_STUDIES[product.id] ||
    {
      headline: aiSpec.system,
      status: product.status || 'product',
      metrics: product.tags?.slice(0, 3).map((tag, idx) => [`0${idx + 1}`, tag]) || [],
      workflow: aiSpec.flows.slice(0, 3).map((flow, idx) => [`0${idx + 1}`, flow]),
      intelligence: aiSpec.outcome,
      fabric: product.features?.slice(0, 4) || product.tags || [],
    };

  return (
    <a
      href={`https://${product.domain}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-white/10 bg-[#080b16] shadow-[0_30px_90px_-45px_rgba(0,0,0,0.9)] transition-all hover:border-white/20"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
            Case study surface
          </div>
          <div className="mt-1 text-[12px] text-slate-300">
            {product.domain}
          </div>
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-100"
          strokeWidth={1.8}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 md:grid-cols-[1fr_190px]">
        <div className="rounded-lg border border-white/10 bg-[#05070d] p-4">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                {product.name}{product.suffix || ''} / {study.status}
              </div>
              <div className="mt-2 max-w-[300px] text-[28px] font-medium leading-[1.05] tracking-[-0.02em] text-white">
                {study.headline}
              </div>
            </div>
            <div className="hidden rounded-md border border-cyan-200/20 bg-cyan-200/[0.05] px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-cyan-100 sm:block">
              {product.status || 'system'}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {study.metrics.map(([value, label]) => (
              <div
                key={`${value}-${label}`}
                className="rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2.5"
              >
                <div className="font-display text-[20px] font-medium text-white">
                  {value}
                </div>
                <div className="mt-0.5 truncate text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {study.workflow.map(([label, body], idx) => (
              <div
                key={`${label}-${body}`}
                className="grid grid-cols-[30px_1fr_auto] items-center gap-3 rounded-md border border-white/[0.08] bg-white/[0.02] p-2.5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded bg-cyan-100/[0.08] ring-1 ring-cyan-100/15">
                  <Workflow className="h-3.5 w-3.5 text-cyan-100" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-medium text-white">
                    {label}
                  </div>
                  <div className="truncate text-[11px] text-slate-500">
                    {body}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Intelligence
            </div>
            <div className="rounded-md border border-cyan-100/15 bg-cyan-100/[0.055] p-3">
              <BrainCircuit className="mb-2 h-4 w-4 text-cyan-100" strokeWidth={1.8} />
              <div className="text-[12px] leading-[1.45] text-slate-200">
                {study.intelligence}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Product fabric
            </div>
            <div className="grid grid-cols-2 gap-2">
              {study.fabric.slice(0, 4).map((item) => (
                <div
                  key={item}
                  className="rounded border border-white/[0.07] bg-black/10 px-2 py-1.5 text-[11px] text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function ProductStrip({ product, idx }) {
  const c = colorCategories[product.category];
  const tonePill =
    TONE_PILL[product.category] || 'bg-white/[0.06] text-slate-300 ring-white/10';
  const reverse = idx % 2 === 1;
  const aiSpec = AI_FLOWS[product.id] || {
    system: 'Vertical product system',
    outcome: product.oneLiner,
    flows: product.tags || [],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-7 md:gap-10 lg:gap-16 items-center ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="relative">
        <CaseStudyMockup product={product} aiSpec={aiSpec} />
      </div>

      <div className="max-w-[590px]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ring-1 ring-inset ${tonePill}`}
          >
            {c.label}
          </span>
          {product.status && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ring-1 ring-inset bg-emerald-500/12 text-emerald-300 ring-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)]" />
              {product.status}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/8 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-cyan-200 ring-1 ring-inset ring-cyan-400/20">
            <BrainCircuit className="h-3 w-3" strokeWidth={1.8} />
            AI-native
          </span>
        </div>

        <h3 className="font-display font-medium text-white text-3xl md:text-[40px] leading-[1.05] tracking-[-0.02em] mb-3">
          {product.name}
          {product.suffix && (
            <span className={c.accent}>{product.suffix}</span>
          )}
        </h3>

        <div className="font-mono text-[12px] text-slate-500 mb-4">
          {product.domain}
        </div>

        <div className="mb-5 rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200">
            {aiSpec.system}
          </div>
          <p className="text-[14px] leading-[1.6] text-slate-300">
            {aiSpec.outcome}
          </p>
        </div>

        <p className="mb-6 max-w-[560px] text-[15px] leading-[1.65] text-slate-400 md:text-[16px]">
          {product.longDescription}
        </p>

        <div className="mb-5 grid max-w-[560px] grid-cols-1 gap-2 sm:grid-cols-2">
          {aiSpec.flows.slice(0, 4).map((flow) => (
            <div
              key={flow}
              className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[12px] text-slate-200"
            >
              <Workflow className="h-3.5 w-3.5 shrink-0 text-cyan-300" strokeWidth={1.7} />
              <span>{flow}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-7 max-w-[540px]">
          {(product.features || product.tags || []).slice(0, 10).map((f) => (
            <span
              key={f}
              className="text-[11px] px-2.5 py-1 rounded bg-white/[0.03] ring-1 ring-white/[0.08] text-slate-400 font-mono"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={`https://${product.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white text-[#07111f] px-5 py-3 rounded-md text-[13px] font-medium flex items-center gap-2 hover:bg-cyan-100 transition-colors"
          >
            <span>Visit Product</span>
            <ArrowUpRight
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </a>
          <a
            href="#contact"
            className="group px-5 py-3 rounded-md text-[13px] font-medium flex items-center gap-2 text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
          >
            <span>Request Demo</span>
            <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsInDetail() {
  const withBanners = products.filter((p) => p.banner);

  if (!withBanners.length) return null;

  return (
    <section
      id="products-detail"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      <div className="mb-12 md:mb-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/80 mb-3">
          Product Portfolio
        </div>
        <h2 className={`${typography.sectionHeading} text-white max-w-[820px] mb-4`}>
          Six products, one product-lab standard.
        </h2>
        <p className={`${typography.bodyLg} max-w-[760px]`}>
          Each product owns a concrete operational layer: intake, CRM, booking,
          payments, dashboards, roles, reminders, reports and AI assistance
          designed into the actual user journey.
        </p>
      </div>

      <div className="mb-14 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          ['Vertical SaaS', 'Built around industry-specific jobs, not generic templates.'],
          ['AI-Native UX', 'Intelligence appears at intake, routing, analysis, reports and follow-up.'],
          ['Production Depth', 'Authentication, roles, payments, portals, alerts and admin controls.'],
        ].map(([title, body]) => (
          <div
            key={title}
            className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
          >
            <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" strokeWidth={1.7} />
            <div className="mb-1.5 text-[15px] font-medium text-white">
              {title}
            </div>
            <div className="text-[13px] leading-[1.55] text-slate-400">
              {body}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-20 md:space-y-28">
        {withBanners.map((p, i) => (
          <ProductStrip key={p.id} product={p} idx={i} />
        ))}
      </div>
    </section>
  );
}
