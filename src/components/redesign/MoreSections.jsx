import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Sparkles,
  Cloud,
  ShieldCheck,
  Lock,
  Activity,
  KeyRound,
  FileCheck2,
  ServerCog,
  Globe,
  HardDriveDownload,
  Rocket,
  Target,
  Wrench,
  Users,
  GraduationCap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { typography } from './tokens';
import { Spotlight } from './interactions';

// Rotating colour palette for icon tiles, so repeated card grids get life
// instead of reading as one uniform block. Icons inherit currentColor.
export const TILE_ACCENTS = [
  'bg-brand-500/12 ring-brand-500/20 text-brand-600 dark:text-brand-300',
  'bg-teal-500/12 ring-teal-500/25 text-teal-600 dark:text-teal-300',
  'bg-amber-500/12 ring-amber-500/25 text-amber-600 dark:text-amber-300',
  'bg-fuchsia-500/12 ring-fuchsia-500/25 text-fuchsia-600 dark:text-fuchsia-300',
  'bg-blue-500/12 ring-blue-500/25 text-blue-600 dark:text-blue-300',
  'bg-emerald-500/12 ring-emerald-500/25 text-emerald-600 dark:text-emerald-300',
];

// Shared header, mono eyebrow + sectionHeading + optional kicker.
function SectionHeader({ eyebrow, title, kicker, accentClass = 'text-brand-600 dark:text-brand-400' }) {
  return (
    <div className="mb-10 md:mb-12">
      <div className={`font-mono text-[11px] uppercase tracking-[0.22em] mb-3 ${accentClass}`}>
        {eyebrow}
      </div>
      <h2 className={`${typography.sectionHeading} text-ink max-w-[760px] mb-4`}>
        {title}
      </h2>
      {kicker && (
        <p className={`${typography.bodyLg} max-w-[680px]`}>{kicker}</p>
      )}
    </div>
  );
}

// =============================================================================
// TECH STACK
// =============================================================================
const techGroups = [
  {
    label: 'Frontend',
    icon: Code2,
    tone: 'violet',
    blurb: 'Web and native app surfaces built from one component system.',
    items: ['Next.js', 'React', 'Flutter', 'Tailwind'],
  },
  {
    label: 'Backend',
    icon: Database,
    tone: 'cyan',
    blurb: 'Transactional services, queues and reporting built to stay online.',
    items: ['.NET', 'PostgreSQL', 'Redis', 'Node.js'],
  },
  {
    label: 'AI',
    icon: Sparkles,
    tone: 'fuchsia',
    blurb: 'Retrieval and agents wired into the workflow, not bolted beside it.',
    items: ['OpenAI', 'Gemini', 'RAG', 'AI Agents'],
  },
  {
    label: 'Infrastructure',
    icon: Cloud,
    tone: 'blue',
    blurb: 'Containerised deploys behind a hardened edge, per-tenant isolation.',
    items: ['AWS', 'Docker', 'Cloudflare', 'Caddy'],
  },
];

const TONE_CLASSES = {
  violet: 'text-brand-600 dark:text-brand-400 bg-white/[0.035] ring-line',
  cyan: 'text-brand-600 dark:text-brand-400 bg-white/[0.035] ring-line',
  fuchsia: 'text-brand-600 dark:text-brand-400 bg-white/[0.035] ring-line',
  blue: 'text-brand-600 dark:text-brand-400 bg-white/[0.035] ring-line',
  emerald: 'text-brand-600 dark:text-brand-400 bg-white/[0.035] ring-line',
  amber: 'text-brand-600 dark:text-brand-400 bg-white/[0.035] ring-line',
};

export function TechStack() {
  return (
    <section
      id="tech"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <SectionHeader
        eyebrow="Technology"
        title="Built with modern technology."
        kicker="The same stack the best product teams ship on. Cloud-native, AI-ready, type-safe end-to-end."
      />

      {/* Continuously scrolling stack strip: motion that says "always running". */}
      <div className="u-marquee relative mb-8 overflow-hidden rounded-lg border border-line bg-surface py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent" />
        <div className="u-marquee-track flex w-max items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={dup === 1}>
              {techGroups.flatMap((g) => g.items).map((it) => (
                <span
                  key={`${dup}-${it}`}
                  className="whitespace-nowrap rounded-md bg-surface-2 px-3 py-1.5 text-[12px] font-medium text-ink-2 ring-1 ring-line"
                >
                  {it}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {techGroups.map((g, i) => {
          const Icon = g.icon;
          return (
            <motion.div key={g.label}
              data-anim className="u-hover u-spotlight rounded-lg bg-surface border border-line p-6"
            >
              <div
                className={`u-tile w-10 h-10 rounded-lg ring-1 ring-inset flex items-center justify-center mb-4 ${TONE_CLASSES[g.tone]}`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mb-1.5">
                {g.label}
              </div>
              <div className="text-[13px] leading-[1.5] text-ink-2">
                {g.blurb}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================================
// SECURITY & COMPLIANCE
// =============================================================================
const securityItems = [
  { icon: Lock, title: 'Encryption at rest + in transit', body: 'TLS 1.2+ everywhere. Sensitive fields encrypted at the column level.' },
  { icon: KeyRound, title: 'Role-based access control', body: 'Fine-grained permissions per role and clinic / tenant.' },
  { icon: Activity, title: 'Audit logs', body: 'Every write traceable to a user, time, and IP. Exportable.' },
  { icon: HardDriveDownload, title: 'Automated backups', body: 'Encrypted point-in-time backups with cross-region replication.' },
  { icon: ShieldCheck, title: 'Secure authentication', body: 'OAuth 2.0, OTP, magic-link, optional 2FA. Rotating refresh tokens.' },
  { icon: FileCheck2, title: 'DPDP-ready architecture', body: 'India DPDP Act and UAE PDPL aligned by design, with DSARs supported.' },
  { icon: ServerCog, title: 'HIPAA-oriented design', body: 'PHI isolation, access logging, and BAA-ready data handling.' },
  { icon: Globe, title: 'Hardened cloud infra', body: 'WAF + DDoS protection at the edge. Per-tenant network isolation.' },
];

export function Security() {
  return (
    <section
      id="security"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

      <SectionHeader
        eyebrow="Security & Compliance"
        title="Enterprise security, by default."
        kicker="Encryption, audit trails, role-based access, and a compliance posture aligned with DPDP, PDPL, and HIPAA. Not a checkbox. A foundation."
        accentClass="text-brand-600/70 dark:text-brand-400/70"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {securityItems.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.title}
              data-anim className="u-hover u-spotlight rounded-lg bg-surface border border-line p-5"
            >
              <div className={`u-tile mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${TILE_ACCENTS[i % TILE_ACCENTS.length]}`}>
                <Icon className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <div className="text-[14px] font-medium text-ink mb-1.5">
                {s.title}
              </div>
              <div className="text-[12px] text-ink-3 leading-[1.55]">
                {s.body}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================================
// ROADMAP
// =============================================================================
const roadmap = [
  { year: 'Q1 2025', title: 'Vellmont founded', body: 'Studio born in Hyderabad to build for India\'s long-tail SMBs.' },
  { year: 'Q2 2025', title: 'MedQuePMS development', body: 'Clinic OS architecture: queue, consult, pharmacy, billing, AI.' },
  { year: 'Q3 2025', title: 'Vedjyotix launch', body: 'Astrology platform + verified astrologer marketplace go live.' },
  { year: 'Q4 2025', title: 'InviteSync + Vellbill launch', body: 'Invitation management on web + mobile, and GST-compliant invoicing ship.' },
  { year: 'Q1–Q2 2026', title: 'Tutora + Vellroute launch', body: 'Global tutor marketplace and tour-operator OS roll out across pilot accounts.' },
  { year: '2026 onwards', title: 'AI-powered SaaS portfolio', body: 'MedQuePMS leads commercial expansion into healthcare while the wider portfolio serves logistics, finance, business automation, visitor management, events and consumer AI.' },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <SectionHeader
        eyebrow="Roadmap"
        title="Where we've been, where we're going."
      />

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/40 to-brand-500/40" />
        <div className="space-y-7">
          {roadmap.map((r, i) => (
            <motion.div key={`${r.year}-${r.title}`}
              data-anim className="relative pl-8"
            >
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-surface ring-2 ring-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]" />
              <div className="text-[12px] font-mono text-violet-700 dark:text-violet-300 tracking-wider mb-1">
                {r.year}
              </div>
              <div className="text-[16px] font-medium text-ink mb-1">
                {r.title}
              </div>
              <div className="text-[14px] text-ink-3 leading-[1.55] max-w-[640px]">
                {r.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// WHY CHOOSE VELLMONT
// =============================================================================
const whyCards = [
  { icon: Sparkles, title: 'AI-First Development', body: 'AI lives inside every workflow we build, not as a feature flag.' },
  { icon: Target, title: 'Product Thinking', body: 'We ship products, not slide decks. UX and outcomes over hours billed.' },
  { icon: Rocket, title: 'Rapid Execution', body: 'Working version in weeks. Iterate on real usage, not roadmaps.' },
  { icon: Layers, title: 'Modern Technology', body: 'A stack built to scale, not the same .NET monolith from 2014.' },
  { icon: Users, title: 'Long-Term Partnership', body: 'Most engagements extend. We keep iterating after launch.' },
  { icon: GraduationCap, title: 'Domain Expertise', body: 'Healthcare, tourism, education, finance. We know the verticals.' },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <SectionHeader
        eyebrow="Why Vellmont"
        title="A product company rhythm, applied to your vertical."
        accentClass="text-brand-600 dark:text-brand-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {whyCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title}
              data-anim className="u-hover u-spotlight rounded-lg bg-surface border border-line p-6"
            >
              <div className={`u-tile mb-4 flex h-10 w-10 items-center justify-center rounded-md ring-1 ${TILE_ACCENTS[i % TILE_ACCENTS.length]}`}>
                <Icon className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <div className="text-[16px] font-medium text-ink mb-1.5">
                {c.title}
              </div>
              <div className="text-[13px] text-ink-3 leading-[1.55]">
                {c.body}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================================
// TESTIMONIALS (placeholders, wired for real ones later)
// =============================================================================
const testimonials = [
  {
    quote:
      "MedQuePMS replaced four tools and a register. Patients book on WhatsApp, the queue moves on its own, the AI pre-read saves us minutes per consult.",
    name: 'Dr. Pilot Clinic',
    role: 'Pilot deployment · placeholder',
    initials: 'PC',
    tone: 'violet',
  },
  {
    quote:
      "Vellroute gave us one screen for tours, vendors, payments and customer comms. We retired three spreadsheets in the first month.",
    name: 'Ops Lead',
    role: 'Tour operator pilot · placeholder',
    initials: 'OL',
    tone: 'cyan',
  },
  {
    quote:
      "Vedjyotix's AI reports + the verified astrologer marketplace are a real combination, instant compatibility + real human depth on call.",
    name: 'Marketplace Astrologer',
    role: 'Early partner · placeholder',
    initials: 'MA',
    tone: 'fuchsia',
  },
];

export function Testimonials() {
  return (
    <section className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24">
      <SectionHeader
        eyebrow="What pilots say"
        title="Trusted by the operators who put real workloads on it."
        kicker="Replacing real testimonials as pilot data lands. Quotes below are illustrative."
        accentClass="text-emerald-700/70 dark:text-emerald-300/70"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {testimonials.map((t, i) => (
          <motion.div key={i}
            data-anim className="rounded-2xl bg-surface border border-line p-6 flex flex-col"
          >
            <div className="text-[15px] text-ink-2 leading-[1.6] mb-5 flex-1">
              <span className="text-violet-700/60 dark:text-violet-300/60">“</span>
              {t.quote}
              <span className="text-violet-700/60 dark:text-violet-300/60">”</span>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-line">
              <div
                className={`w-9 h-9 rounded-full ring-1 ring-inset flex items-center justify-center font-mono text-[12px] font-medium ${TONE_CLASSES[t.tone]}`}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-[13px] font-medium text-ink">
                  {t.name}
                </div>
                <div className="text-[11px] font-mono text-ink-3">
                  {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// BLOG TEASER
// =============================================================================
const blogCats = [
  { name: 'Healthcare', tone: 'violet' },
  { name: 'Tourism', tone: 'cyan' },
  { name: 'Business Automation', tone: 'blue' },
  { name: 'AI', tone: 'fuchsia' },
  { name: 'Product Engineering', tone: 'emerald' },
];

const blogTeasers = [
  {
    cat: 'Healthcare',
    tone: 'violet',
    title: 'Why the patient queue is the wrong place to digitise first.',
    read: '5 min · soon',
  },
  {
    cat: 'AI',
    tone: 'fuchsia',
    title: 'The case against AI-first products that don\'t do anything.',
    read: '7 min · soon',
  },
  {
    cat: 'Product Engineering',
    tone: 'emerald',
    title: 'Shipping a clinic OS to 6 sites in 6 weeks, what we cut.',
    read: '6 min · soon',
  },
];

export function BlogTeaser() {
  return (
    <section
      id="blog"
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <SectionHeader
        eyebrow="From the studio"
        title="Notes from the build."
        kicker="Long-form writing on healthcare, tourism, automation and AI. Launching alongside the product roadmap."
        accentClass="text-blue-700/70 dark:text-blue-300/70"
      />

      {/* category pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {blogCats.map((c) => (
          <span
            key={c.name}
            className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full ring-1 ring-inset ${TONE_CLASSES[c.tone]}`}
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {blogTeasers.map((b, i) => (
          <motion.div key={i}
            data-anim className="group rounded-2xl bg-surface border border-line p-6 hover:bg-surface hover:border-line-strong transition-colors cursor-pointer"
          >
            <div
              className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ring-inset mb-4 ${TONE_CLASSES[b.tone]}`}
            >
              {b.cat}
            </div>
            <div className="text-[16px] font-medium text-ink leading-[1.4] mb-3 max-w-[280px]">
              {b.title}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-ink-3">
              <span>{b.read}</span>
              <ArrowUpRight
                className="w-4 h-4 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                strokeWidth={1.6}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
