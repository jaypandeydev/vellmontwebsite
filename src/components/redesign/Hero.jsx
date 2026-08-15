import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  Layers3,
  ShieldCheck,
  MessageSquare,
  Route,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import {
  products,
} from './tokens';

const metrics = [
  { value: '7', label: 'Vertical products' },
  { value: '6', label: 'Live brands' },
  { value: '28+', label: 'Core workflows' },
  { value: 'IN + UAE', label: 'Markets' },
];

const proofPoints = [
  {
    icon: Layers3,
    title: 'Product portfolio',
    body: 'Enterprise software across healthcare, logistics, finance, business automation and consumer AI.',
  },
  {
    icon: BrainCircuit,
    title: 'Applied intelligence',
    body: 'AI sits inside intake, routing, reporting, follow-up and recommendations where operators already work.',
  },
  {
    icon: CheckCircle2,
    title: 'Production surfaces',
    body: 'Roles, dashboards, payments, portals, alerts and admin controls are designed as complete systems.',
  },
];

const labNotes = [
  'Clinic queues, WhatsApp bookings and AI pre-read',
  'Logistics, tour CRM, vendors and traveller portals',
  'GST billing, visitor management, events and business automation',
];

const labProducts = [
  {
    id: 'medquepms',
    name: 'MedQuePMS',
    domain: 'Clinic OS',
    metric: '184 patients',
    context: 'live clinic',
    title: 'Operational workflow',
    badge: 'production',
    metrics: [
      ['184', 'patients today'],
      ['11m', 'avg wait'],
      ['47', 'whatsapp bookings'],
    ],
    events: [
      ['Patient asks on WhatsApp', 'Book me with Dr. Rao tomorrow', MessageSquare],
      ['AI resolves intent', 'Slot, doctor, fee and branch matched', BrainCircuit],
      ['Operations update', 'Token A-118, UPI paid, queue updated', Activity],
    ],
    insight: 'Patient history summarized before consult.',
    sideStats: [
      ['risk flags', '3'],
      ['records read', '18'],
    ],
    fabric: [
      ['Queue', 'live tokens'],
      ['TPA', 'cashless'],
      ['POS', 'pharmacy'],
    ],
    icon: Stethoscope,
  },
  {
    id: 'vellroute',
    name: 'Vellroute',
    domain: 'Tour OS',
    metric: '6-day trip',
    context: 'tour operator',
    title: 'Trip command center',
    badge: 'live',
    metrics: [
      ['42', 'active leads'],
      ['18', 'bookings'],
      ['7', 'vendors'],
    ],
    events: [
      ['Lead enters from WhatsApp', 'Dubai family wants Rajasthan plan', MessageSquare],
      ['AI drafts itinerary', 'Hotels, driver and day plan suggested', BrainCircuit],
      ['Operator confirms', 'Voucher, invoice and portal shared', Route],
    ],
    insight: 'Traveller preferences converted into a bookable itinerary.',
    sideStats: [
      ['languages', '3'],
      ['vendors', '7'],
    ],
    fabric: [
      ['CRM', 'tour leads'],
      ['Vendors', 'hotels'],
      ['Portal', 'travellers'],
    ],
    icon: Route,
  },
  {
    id: 'vellbill',
    name: 'Vellbill',
    domain: 'Finance OS',
    metric: 'GST ready',
    context: 'SMB finance',
    title: 'Billing loop',
    badge: 'live',
    metrics: [
      ['31', 'invoices'],
      ['12', 'due soon'],
      ['GST', 'ready'],
    ],
    events: [
      ['Order arrives', 'Client confirms scope on WhatsApp', MessageSquare],
      ['Invoice drafted', 'GST, line items and tax split ready', BrainCircuit],
      ['Payment tracked', 'UPI link sent and reminder scheduled', CreditCard],
    ],
    insight: 'Invoice, tax and payment follow-up stay in one ledger.',
    sideStats: [
      ['tax reports', '4'],
      ['reminders', '12'],
    ],
    fabric: [
      ['GST', 'invoices'],
      ['Quotes', 'PDFs'],
      ['Ledger', 'clients'],
    ],
    icon: CreditCard,
  },
  {
    id: 'invitesync',
    name: 'InviteSync',
    domain: 'Social OS',
    metric: 'RSVP sync',
    context: 'event memory',
    title: 'Invitation intelligence',
    badge: 'live',
    metrics: [
      ['86', 'contacts'],
      ['29', 'RSVPs'],
      ['4', 'reminders'],
    ],
    events: [
      ['Invite captured', 'Wedding invite added from family chat', MessageSquare],
      ['AI organizes event', 'Date, venue and family group detected', BrainCircuit],
      ['Calendar synced', 'RSVP reminders and tasks scheduled', CalendarCheck2],
    ],
    insight: 'Events become shared memory with reminders and family visibility.',
    sideStats: [
      ['groups', '5'],
      ['tasks', '14'],
    ],
    fabric: [
      ['RSVP', 'events'],
      ['Calendar', 'sync'],
      ['Family', 'sharing'],
    ],
    icon: CalendarCheck2,
  },
  {
    id: 'vellpass',
    name: 'Vellpass',
    domain: 'Gatepass OS',
    metric: 'QR entry',
    context: 'facility gate',
    title: 'Visitor access layer',
    badge: 'live',
    metrics: [
      ['128', 'visitors'],
      ['24', 'pre-approved'],
      ['8', 'open passes'],
    ],
    events: [
      ['Visitor arrives', 'QR gatepass scanned at security desk', ShieldCheck],
      ['Host approval checked', 'Resident or admin approval verified', BrainCircuit],
      ['Entry logged', 'Check-in, purpose and audit trail saved', Activity],
    ],
    insight: 'Entry context, host approval and visitor history stay visible before access is granted.',
    sideStats: [
      ['open passes', '8'],
      ['sites', '3'],
    ],
    fabric: [
      ['Gatepass', 'QR entry'],
      ['Host', 'approval'],
      ['Audit', 'logs'],
    ],
    icon: ShieldCheck,
  },
];

function ProductShowcase() {
  const liveCount = products.filter((p) =>
    ['Live', 'Production Ready'].includes(p.status)
  ).length;
  const [activeId, setActiveId] = useState('medquepms');
  const activeProduct =
    labProducts.find((product) => product.id === activeId) || labProducts[0];

  return (
    <div className="mobile-viewport-lock relative w-full max-w-[720px] sm:max-w-[720px]">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0e1122] shadow-[0_40px_100px_-40px_rgba(20,18,60,0.55)] ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              Vellmont lab console
            </div>
            <div className="mt-1 truncate text-[12px] text-slate-300">
              Portfolio intelligence across live product systems
              <span className="text-slate-400"> · sample data</span>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-brand-200/20 bg-brand-500/[0.06] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-brand-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {liveCount} live brands
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr]">
          <div className="border-b border-white/10 bg-white/[0.035] p-3 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Product lines
              </div>
              <Sparkles className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.8} />
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {labProducts.map((product, idx) => {
                const Icon = product.icon;
                const isActive = product.id === activeId;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveId(product.id)}
                    className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                      isActive
                        ? 'border-brand-200/25 bg-brand-200/[0.055]'
                        : 'border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/[0.035] ring-1 ring-white/10">
                          <Icon className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 truncate text-[12px] font-medium text-white">
                          {product.name}
                        </div>
                      </div>
                      {isActive && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider">
                      <span className="truncate text-slate-400">{product.domain}</span>
                      <span className="text-slate-400">{product.metric}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-300">
                      {activeProduct.name} / {activeProduct.context}
                    </div>
                    <div className="mt-1 text-[22px] font-medium leading-none text-white">
                      {activeProduct.title}
                    </div>
                  </div>
                  <div className="rounded-md border border-emerald-300/20 bg-emerald-300/[0.055] px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                    {activeProduct.badge}
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2">
                  {activeProduct.metrics.map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5"
                    >
                      <div className="font-display text-[20px] font-medium text-white">
                        {value}
                      </div>
                      <div className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-400">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {activeProduct.events.map(([label, value, Icon], idx) => {
                    return (
                      <div
                        key={label}
                        className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-2.5"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-500/[0.08] ring-1 ring-brand-100/15">
                          <Icon className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-medium text-white">
                            {label}
                          </div>
                          <div className="truncate text-[11px] text-slate-400">
                            {value}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          0{idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    AI pre-read
                  </div>
                  <div className="mb-3 rounded-md border border-brand-100/15 bg-brand-500/[0.055] p-3">
                    <BrainCircuit className="mb-2 h-4 w-4 text-brand-300" strokeWidth={1.8} />
                    <div className="text-[12px] leading-[1.45] text-slate-300">
                      {activeProduct.insight}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {activeProduct.sideStats.map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span>{label}</span>
                        <span className="text-brand-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Portfolio fabric
                  </div>
                  <div className="space-y-2">
                    {activeProduct.fabric.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded border border-white/10 bg-black/10 px-2 py-1.5 text-[11px]"
                      >
                        <span className="font-mono text-brand-300">{key}</span>
                        <span className="text-slate-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['Auth', 'roles + tenants'],
                ['Payments', 'UPI + gateway'],
                ['Comms', 'WhatsApp + alerts'],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2"
                >
                  <div className="text-[11px] font-medium text-white">{title}</div>
                  <div className="mt-0.5 truncate text-[10px] text-slate-400">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-x-6 -bottom-8 -z-10 h-24 bg-brand-500/[0.035] blur-3xl" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas px-5 pb-14 pt-12 md:px-10 md:pb-20 md:pt-20 lg:px-20">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_82%_-5%,rgba(88,72,248,0.16),transparent_60%),radial-gradient(45%_50%_at_98%_35%,rgba(217,70,239,0.10),transparent_60%),radial-gradient(50%_45%_at_-5%_8%,rgba(245,158,11,0.08),transparent_58%),radial-gradient(40%_40%_at_60%_75%,rgba(59,130,246,0.06),transparent_60%)] dark:opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-6 flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 overflow-hidden rounded-md border border-line bg-surface-tint px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-2 sm:inline-flex sm:text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span className="text-brand-600 dark:text-brand-400">Premium product lab</span>
          <span className="hidden text-ink-3 sm:inline">/</span>
          <span className="hidden sm:inline">AI-native vertical SaaS</span>
          <span className="hidden text-ink-3 sm:inline">·</span>
          <span className="hidden sm:inline">Hyderabad + Dubai</span>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="min-w-0">
            <h1
              className="mb-6 max-w-[760px] font-display text-[40px] font-semibold leading-[1.04] tracking-[-0.025em] text-ink sm:text-5xl md:text-6xl lg:text-[70px]"
            >
              <span className="block sm:inline">AI software for </span>
              <span className="block sm:inline">clinics, tour operators </span>
              <span className="block sm:inline">and small businesses.</span>
            </h1>

            <div className="mb-7 max-w-[320px] space-y-3 sm:max-w-[620px]">
              <p className="text-[17px] leading-[1.65] text-ink-2 md:text-[18px]">
                Vellmont Services is an AI-powered SaaS company building
                enterprise software across healthcare, logistics, finance,
                business automation, and consumer AI. Our flagship platform,
                MedQuePMS, leads our commercial expansion into healthcare.
              </p>
              <p className="border-l-2 border-brand-500/40 pl-4 text-[14px] leading-[1.65] text-ink-3 md:text-[15px]">
                A wider portfolio of production-ready products across adjacent
                verticals proves the product depth behind the company.
              </p>
            </div>

            <div className="mb-8 space-y-2">
              {labNotes.map((note) => (
                <div
                  key={note}
                  className="flex items-start gap-2 text-[13px] leading-[1.5] text-ink-2"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                    strokeWidth={1.8}
                  />
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <div className="mb-9 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <a
                href="https://calendly.com/finance-vellmontservices/" target="_blank" rel="noopener noreferrer"
                className="group flex min-w-0 items-center justify-center gap-2 rounded-md bg-brand-500 px-5 py-3.5 text-[14px] font-medium text-white shadow-[0_18px_40px_-24px_rgba(88,72,248,0.55)] transition-colors hover:bg-brand-600 sm:justify-start sm:px-6"
              >
                <span>Book a demo</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
              <a
                href="#products-detail"
                className="group flex min-w-0 items-center justify-center gap-2 rounded-md border border-line-strong bg-surface px-5 py-3.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface-2 sm:justify-start sm:px-6"
              >
                <span>View products</span>
                <span className="text-ink-3 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            <div className="mb-5 hidden max-w-[680px] grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid md:grid-cols-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-surface px-4 py-4"
                >
                  <div className="text-[18px] md:text-[20px] font-display font-semibold text-ink tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden max-w-[700px] grid-cols-1 gap-2 sm:grid sm:grid-cols-3">
              {proofPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="rounded-md border border-line bg-surface p-3.5 shadow-[0_1px_2px_rgba(16,18,34,0.05)]"
                  >
                    <Icon
                      className="mb-2 h-4 w-4 text-brand-500"
                      strokeWidth={1.7}
                    />
                    <div className="mb-1 text-[12px] font-medium text-ink">
                      {point.title}
                    </div>
                    <div className="text-[11px] leading-[1.45] text-ink-3">
                      {point.body}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 flex justify-center lg:justify-end">
            <ProductShowcase />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
