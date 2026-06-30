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
  MessageSquare,
  Route,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import {
  products,
} from './tokens';

const metrics = [
  { value: '6', label: 'Vertical products' },
  { value: '5', label: 'Live brands' },
  { value: '24+', label: 'Core workflows' },
  { value: 'IN + UAE', label: 'Markets' },
];

const proofPoints = [
  {
    icon: Layers3,
    title: 'Product portfolio',
    body: 'Healthcare, tourism, finance, astrology, invitations and tutoring run as owned product lines.',
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
  'Tour CRM, vendors, itineraries and traveller portals',
  'GST billing, RSVP tracking and marketplace workflows',
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
];

function ProductShowcase() {
  const liveCount = products.filter((p) => p.status === 'Live').length;
  const [activeId, setActiveId] = useState('medquepms');
  const activeProduct =
    labProducts.find((product) => product.id === activeId) || labProducts[0];

  return (
    <div className="mobile-viewport-lock relative w-full max-w-[720px] sm:max-w-[720px]">
      <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#080b16] shadow-[0_34px_90px_-45px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Vellmont lab console
            </div>
            <div className="mt-1 truncate text-[12px] text-slate-300">
              Portfolio intelligence across live product systems
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-cyan-200/20 bg-cyan-200/[0.05] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-cyan-100 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-100" />
            {liveCount} live brands
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr]">
          <div className="border-b border-white/10 bg-white/[0.015] p-3 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Product lines
              </div>
              <Sparkles className="h-3.5 w-3.5 text-cyan-100" strokeWidth={1.8} />
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
                        ? 'border-cyan-200/25 bg-cyan-200/[0.055]'
                        : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/[0.045] ring-1 ring-white/10">
                          <Icon className="h-3.5 w-3.5 text-cyan-100" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 truncate text-[12px] font-medium text-white">
                          {product.name}
                        </div>
                      </div>
                      {isActive && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-100" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider">
                      <span className="truncate text-slate-500">{product.domain}</span>
                      <span className="text-slate-400">{product.metric}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
              <div className="rounded-lg border border-white/10 bg-[#05070d] p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                      {activeProduct.name} / {activeProduct.context}
                    </div>
                    <div className="mt-1 text-[22px] font-medium leading-none text-white">
                      {activeProduct.title}
                    </div>
                  </div>
                  <div className="rounded-md border border-emerald-300/20 bg-emerald-300/[0.055] px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-200">
                    {activeProduct.badge}
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2">
                  {activeProduct.metrics.map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2.5"
                    >
                      <div className="font-display text-[20px] font-medium text-white">
                        {value}
                      </div>
                      <div className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-500">
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
                        className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-md border border-white/[0.08] bg-white/[0.02] p-2.5"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-cyan-100/[0.08] ring-1 ring-cyan-100/15">
                          <Icon className="h-3.5 w-3.5 text-cyan-100" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-medium text-white">
                            {label}
                          </div>
                          <div className="truncate text-[11px] text-slate-500">
                            {value}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          0{idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    AI pre-read
                  </div>
                  <div className="mb-3 rounded-md border border-cyan-100/15 bg-cyan-100/[0.055] p-3">
                    <BrainCircuit className="mb-2 h-4 w-4 text-cyan-100" strokeWidth={1.8} />
                    <div className="text-[12px] leading-[1.45] text-slate-200">
                      {activeProduct.insight}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {activeProduct.sideStats.map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span>{label}</span>
                        <span className="text-cyan-100">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Portfolio fabric
                  </div>
                  <div className="space-y-2">
                    {activeProduct.fabric.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded border border-white/[0.07] bg-black/10 px-2 py-1.5 text-[11px]"
                      >
                        <span className="font-mono text-cyan-100">{key}</span>
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
                  className="rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2"
                >
                  <div className="text-[11px] font-medium text-white">{title}</div>
                  <div className="mt-0.5 truncate text-[10px] text-slate-500">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-x-6 -bottom-8 -z-10 h-24 bg-cyan-100/[0.035] blur-3xl" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-12 md:px-10 md:pb-20 md:pt-20 lg:px-20">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_35%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'linear-gradient(to bottom, black, transparent 82%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-6 flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 overflow-hidden rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-300 backdrop-blur-sm sm:inline-flex sm:text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
          <span className="text-cyan-200">Premium product lab</span>
          <span className="hidden text-slate-600 sm:inline">/</span>
          <span className="hidden sm:inline">AI-native vertical SaaS</span>
          <span className="hidden text-slate-500 sm:inline">·</span>
          <span className="hidden sm:inline">Hyderabad + Dubai</span>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="min-w-0">
            <h1
              className="mb-6 max-w-[760px] font-display text-[40px] font-medium leading-[1.04] tracking-[-0.025em] text-white sm:text-5xl md:text-6xl lg:text-[70px]"
            >
              <span className="block sm:inline">AI product </span>
              <span className="block sm:inline">systems for </span>
              <span className="block sm:inline">real-world </span>
              <span className="block sm:inline">operations.</span>
            </h1>

            <p className="mb-7 max-w-[320px] text-[17px] leading-[1.65] text-slate-300 sm:max-w-[620px] md:text-[18px]">
              Vellmont builds vertical SaaS products that turn messy daily
              operations into polished workflows, with AI embedded at the exact
              point of work.
            </p>

            <div className="mb-8 space-y-2">
              {labNotes.map((note) => (
                <div
                  key={note}
                  className="flex items-start gap-2 text-[13px] leading-[1.5] text-slate-300"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200"
                    strokeWidth={1.8}
                  />
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <div className="mb-9 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <a
                href="#products-detail"
                className="group flex min-w-0 items-center justify-center gap-2 rounded-md bg-white px-5 py-3.5 text-[14px] font-medium text-[#07111f] shadow-[0_18px_40px_-24px_rgba(255,255,255,0.7)] transition-colors hover:bg-cyan-100 sm:justify-start sm:px-6"
              >
                <span>View Product Portfolio</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
              <a
                href="#contact"
                className="group flex min-w-0 items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3.5 text-[14px] font-medium text-white backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/[0.04] sm:justify-start sm:px-6"
              >
                <span>Build With Us</span>
                <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            <div className="mb-5 hidden max-w-[680px] grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] sm:grid md:grid-cols-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-[#070b14]/90 px-4 py-4"
                >
                  <div className="text-[18px] md:text-[20px] font-display font-medium text-white tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
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
                    className="rounded-md border border-white/[0.08] bg-white/[0.025] p-3.5"
                  >
                    <Icon
                      className="mb-2 h-4 w-4 text-cyan-300"
                      strokeWidth={1.7}
                    />
                    <div className="mb-1 text-[12px] font-medium text-white">
                      {point.title}
                    </div>
                    <div className="text-[11px] leading-[1.45] text-slate-400">
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
