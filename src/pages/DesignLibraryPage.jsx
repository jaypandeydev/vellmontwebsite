import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';
import { typography, colorCategories } from '@/components/redesign/tokens';
import { CountUp, CopyButton, GlobalSpotlight, Reveal } from '@/components/redesign/interactions';
import Flag from '@/components/redesign/Flag';

// Living design library for the Vellmont light-first system.
// It renders the real semantic tokens, type scale and component patterns
// used across the site, so it stays in sync with the source of truth.
// Unlisted route: /design-library (not linked in the public nav or footer).
// Sections are shown one tab at a time rather than one long scroll.

const CALENDLY = 'https://calendly.com/finance-vellmontservices/';

function useTheme() {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );
  const toggle = () => {
    const el = document.documentElement;
    const next = !el.classList.contains('dark');
    el.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch (e) {}
    setDark(next);
  };
  return { dark, toggle };
}

// --- token reference data (values mirror src/index.css and tailwind.config.js) ---
const SEMANTIC = [
  { name: 'canvas', cls: 'bg-canvas', varName: '--bg', light: '#ffffff', dark: '#0b0d14' },
  { name: 'canvas-2', cls: 'bg-canvas-2', varName: '--bg-secondary', light: '#f6f7fb', dark: '#0f121b' },
  { name: 'surface', cls: 'bg-surface', varName: '--surface', light: '#ffffff', dark: '#12141d' },
  { name: 'surface-2', cls: 'bg-surface-2', varName: '--surface-muted', light: '#f1f3f9', dark: '#141720' },
  { name: 'surface-tint', cls: 'bg-surface-tint', varName: '--surface-tint', light: '#f4f3ff', dark: '#16162e' },
  { name: 'accent', cls: 'bg-accent', varName: '--accent', light: '#f59e0b', dark: '#fbbf24' },
  { name: 'accent-soft', cls: 'bg-accent-soft', varName: '--accent-soft', light: '#fef4e2', dark: 'rgba(251,191,36,.13)' },
];

const INK = [
  { name: 'ink', cls: 'bg-ink', varName: '--tp', light: '#10121f', dark: '#f4f6fb', role: 'Text primary' },
  { name: 'ink-2', cls: 'bg-ink-2', varName: '--ts', light: '#4b5162', dark: '#aab0c2', role: 'Text secondary' },
  { name: 'ink-3', cls: 'bg-ink-3', varName: '--tt', light: '#8b90a1', dark: '#737a8c', role: 'Text tertiary / mono' },
  { name: 'line', cls: 'bg-line', varName: '--line', light: '#e7e9f1', dark: 'rgba(255,255,255,.10)', role: 'Hairline border' },
  { name: 'line-strong', cls: 'bg-line-strong', varName: '--line-strong', light: '#d2d6e2', dark: 'rgba(255,255,255,.18)', role: 'Stronger border' },
];

const BRAND = [
  { step: 50, cls: 'bg-brand-50', hex: '#f1eefe' },
  { step: 100, cls: 'bg-brand-100', hex: '#e2ddfe' },
  { step: 200, cls: 'bg-brand-200', hex: '#c8c1fd' },
  { step: 300, cls: 'bg-brand-300', hex: '#a99ffb' },
  { step: 400, cls: 'bg-brand-400', hex: '#8b84f8' },
  { step: 500, cls: 'bg-brand-500', hex: '#5848f8', note: 'Primary' },
  { step: 600, cls: 'bg-brand-600', hex: '#4a37e6', note: 'Hover' },
  { step: 700, cls: 'bg-brand-700', hex: '#3d2bc9' },
];

const RADII = [
  { name: 'sm', px: '8px', cls: 'rounded-lg' },
  { name: 'md', px: '12px', cls: 'rounded-xl' },
  { name: 'lg', px: '18px', cls: 'rounded-2xl' },
  { name: 'xl', px: '26px', cls: 'rounded-3xl' },
  { name: 'pill', px: '9999px', cls: 'rounded-full' },
];

const SPACE = [1, 2, 3, 4, 6, 8, 12, 16, 24];

const TABS = [
  { id: 'colour', label: 'Colour', group: 'Foundations' },
  { id: 'typography', label: 'Typography', group: 'Foundations' },
  { id: 'radii', label: 'Radii', group: 'Foundations' },
  { id: 'spacing', label: 'Spacing', group: 'Foundations' },
  { id: 'buttons', label: 'Buttons', group: 'Components' },
  { id: 'badges', label: 'Badges', group: 'Components' },
  { id: 'cards', label: 'Cards', group: 'Components' },
  { id: 'motion', label: 'Interactions', group: 'Components' },
];

// --- small layout helpers ---
function PanelHead({ eyebrow, title, desc }) {
  return (
    <div className="mb-8">
      <div className={typography.monoLabel + ' mb-2'}>{eyebrow}</div>
      <h2 className={typography.sectionHeading + ' text-ink'}>{title}</h2>
      {desc && <p className="mt-2 max-w-[640px] text-[15px] leading-[1.6] text-ink-2">{desc}</p>}
    </div>
  );
}

function Swatch({ cls, label, sub, hex, border }) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <div className={`${cls} h-16 ${border ? 'border-b border-line' : ''}`} />
      <div className="px-3 py-2.5">
        <div className="text-[12.5px] font-medium text-ink">{label}</div>
        {sub && <div className="text-[11px] font-mono text-ink-3 mt-0.5">{sub}</div>}
        {hex && <div className="text-[11px] font-mono text-ink-3 mt-0.5">{hex}</div>}
      </div>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-6 ${className}`}>{children}</div>
  );
}

// --- panels ---
function ColourPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Foundations"
        title="Colour tokens"
        desc="Semantic tokens map to CSS variables that remap between light and dark. Build with the semantic names (bg-canvas, text-ink, border-line), never raw hex."
      />
      <div className="space-y-8">
        <div>
          <div className="text-[13px] font-medium text-ink mb-3">Surfaces</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SEMANTIC.map((s) => (
              <Swatch key={s.name} cls={s.cls} border label={s.name} sub={s.varName} hex={`${s.light} / ${s.dark}`} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[13px] font-medium text-ink mb-3">Text &amp; lines</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {INK.map((s) => (
              <Swatch key={s.name} cls={s.cls} label={s.name} sub={s.role} hex={`${s.light} / ${s.dark}`} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[13px] font-medium text-ink mb-3">
            Brand indigo <span className="font-mono text-ink-3">· brand.500 = #5848f8</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BRAND.map((b) => (
              <div key={b.step} className="rounded-lg border border-line overflow-hidden">
                <div className={`${b.cls} h-14`} />
                <div className="px-2 py-1.5 bg-surface">
                  <div className="text-[11px] font-mono text-ink">{b.step}</div>
                  <div className="text-[10px] font-mono text-ink-3">{b.hex}</div>
                  {b.note && <div className="text-[10px] text-brand-600 dark:text-brand-400">{b.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[13px] font-medium text-ink mb-3">
            Category accents <span className="font-mono text-ink-3">(colorCategories)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(colorCategories).map(([key, c]) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider ${c.pillBg} ${c.pillText}`}
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographyPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Foundations"
        title="Typography"
        desc="Geist for display, Inter for body, JetBrains Mono for labels. The type helpers live in tokens.js and are used verbatim across the site."
      />
      <Card className="space-y-8">
        <div>
          <div className={typography.monoLabel + ' mb-2'}>displayHeadline</div>
          <div className={typography.displayHeadline + ' text-ink'}>AI software for operators.</div>
        </div>
        <div className="border-t border-line pt-8">
          <div className={typography.monoLabel + ' mb-2'}>sectionHeading + italicAccent</div>
          <div className={typography.sectionHeading + ' text-ink'}>
            The clinic <span className={typography.italicAccent}>operating system</span>.
          </div>
        </div>
        <div className="border-t border-line pt-8">
          <div className={typography.monoLabel + ' mb-2'}>bodyLg</div>
          <p className={typography.bodyLg + ' max-w-[640px]'}>
            Vellmont builds production-grade vertical SaaS, AI-first by default,
            for the way operational businesses actually work.
          </p>
        </div>
        <div className="border-t border-line pt-8">
          <div className={typography.monoLabel + ' mb-2'}>monoLabel</div>
          <div className={typography.monoLabel}>Premium product lab · Hyderabad + Dubai</div>
        </div>
      </Card>
    </div>
  );
}

function RadiiPanel() {
  return (
    <div>
      <PanelHead eyebrow="Foundations" title="Radii" desc="Corner rounding scale, from controls to large cards to pills." />
      <div className="flex flex-wrap gap-4">
        {RADII.map((r) => (
          <div key={r.name} className="text-center">
            <div className={`w-24 h-16 bg-brand-500/10 ring-1 ring-brand-500/25 ${r.cls}`} />
            <div className="mt-2 text-[12px] font-medium text-ink">{r.name}</div>
            <div className="text-[11px] font-mono text-ink-3">{r.px}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacingPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Foundations"
        title="Spacing"
        desc="A 4px base scale. Use consistent steps for padding and gaps rather than arbitrary values."
      />
      <div className="space-y-2">
        {SPACE.map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div className="w-16 text-[12px] font-mono text-ink-3">{s} · {s * 4}px</div>
            <div className="h-4 bg-brand-500/25 rounded" style={{ width: `${s * 4}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ButtonsPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Components"
        title="Buttons"
        desc="Indigo primary for the single most important action per view; bordered secondary for the alternative; ghost for tertiary navigation."
      />
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-600"
          >
            <span>Book a demo</span>
            <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-line-strong bg-surface px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2"
          >
            <span>View products</span>
            <span aria-hidden="true" className="text-ink-3">→</span>
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-ink hover:bg-surface-2"
          >
            Ghost link
          </button>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            Visit product <ArrowUpRight size={15} />
          </a>
        </div>
      </Card>
    </div>
  );
}

function BadgesPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Components"
        title="Badges &amp; tags"
        desc="Status chips, the AI-native marker, and feature tags. Status colours use tinted fills with a ring so they read on both themes."
      />
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Production Ready
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/12 ring-1 ring-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider">
            Beta
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 ring-1 ring-brand-500/25 text-brand-600 dark:text-brand-400 text-[10px] font-mono uppercase tracking-wider">
            AI-Native
          </span>
        </div>
        <div className="border-t border-line pt-6">
          <div className="text-[12px] font-mono text-ink-3 mb-3">Feature tags</div>
          <div className="flex flex-wrap gap-1.5">
            {['Queue Management', 'WhatsApp Booking', 'AI Pre-Read', 'Pharmacy', 'Billing', 'Patient App'].map((f) => (
              <span key={f} className="text-[11px] px-2.5 py-1 rounded-md bg-surface ring-1 ring-line text-ink-2 font-mono">
                {f}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CardsPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Components"
        title="Cards"
        desc="Depth comes from tone and a hairline border first, a soft shadow second. Avoid glass and glow."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 ring-1 ring-brand-500/20 flex items-center justify-center mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-[15px]">◆</span>
          </div>
          <div className="text-[15px] font-medium text-ink mb-1">Feature card</div>
          <p className="text-[13px] leading-[1.55] text-ink-2">
            Surface, hairline border, tinted icon tile. The workhorse block for grids.
          </p>
        </Card>
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_-12px_rgba(16,18,31,0.12)]">
          <div className="text-[12px] font-mono text-ink-3 mb-2">Elevated</div>
          <div className="text-[15px] font-medium text-ink mb-1">Soft shadow</div>
          <p className="text-[13px] leading-[1.55] text-ink-2">
            Reserved for elements that float above the page, like the hero console.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-gradient-to-br from-surface-tint to-surface p-6">
          <div className="text-[12px] font-mono text-ink-3 mb-2">Tinted</div>
          <div className="text-[15px] font-medium text-ink mb-1">Brand wash</div>
          <p className="text-[13px] leading-[1.55] text-ink-2">
            A soft surface-tint gradient for sections that need quiet emphasis.
          </p>
        </div>
      </div>
    </div>
  );
}


function MotionPanel() {
  return (
    <div>
      <PanelHead
        eyebrow="Components"
        title="Interactions &amp; motion"
        desc="Global interaction utilities. Add the class or component and the behaviour comes with it. All of them respect the reduced-motion setting."
      />
      <div className="space-y-4">
        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Hover lift <span className="font-mono text-ink-3">.u-hover</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Lifts on hover', 'Border strengthens', 'Soft shadow grows'].map((t) => (
              <div key={t} className="u-hover u-spotlight rounded-lg border border-line bg-surface p-5">
                <div className="text-[13px] text-ink">{t}</div>
                <div className="mt-1 text-[12px] text-ink-3">Hover me</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Cursor spotlight <span className="font-mono text-ink-3">.u-spotlight</span>
          </div>
          <div className="u-spotlight rounded-lg border border-line bg-surface p-8 text-center">
            <div className="text-[13px] text-ink-2">
              Move your cursor across this panel, the brand glow follows.
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Icon tile reaction <span className="font-mono text-ink-3">.u-tile</span>
          </div>
          <div className="u-hover rounded-lg border border-line bg-surface p-5 inline-flex items-center gap-3">
            <div className="u-tile flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/12 ring-1 ring-brand-500/20 text-brand-600 dark:text-brand-300">
              ◆
            </div>
            <span className="text-[13px] text-ink-2">Tile scales and tilts with the card</span>
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Count up <span className="font-mono text-ink-3">&lt;CountUp /&gt;</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-lg border border-line bg-line">
            {['7', '28+', '4.6x', '37%'].map((v) => (
              <div key={v} className="bg-surface px-4 py-4">
                <div className="font-display text-[20px] font-semibold tracking-tight text-ink">
                  <CountUp value={v} />
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-3">
                  animates in view
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Copy to clipboard <span className="font-mono text-ink-3">&lt;CopyButton /&gt;</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[14px] text-ink">support@vellmontservices.com</span>
            <CopyButton
              text="support@vellmontservices.com"
              className="border border-line text-ink-2 hover:border-line-strong hover:text-ink"
            />
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Press feedback <span className="font-mono text-ink-3">.u-press</span> and link sweep{' '}
            <span className="font-mono text-ink-3">.u-link</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="u-press rounded-md bg-brand-500 px-5 py-2.5 text-[13px] font-medium text-white shadow-[0_14px_34px_-14px_rgba(88,72,248,0.7)] hover:bg-brand-400"
            >
              Press me
            </button>
            <a href="#motion" className="u-link text-[13px] font-medium text-brand-600 dark:text-brand-400">
              Underline sweeps in
            </a>
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">
            Page-level <span className="font-mono text-ink-3">&lt;ScrollProgress /&gt; &lt;BackToTop /&gt; &lt;Reveal /&gt;</span>
          </div>
          <div className="space-y-2 text-[13px] text-ink-2">
            <Reveal><div>Scroll progress bar sits at the very top of the page.</div></Reveal>
            <Reveal delay={90}><div>Back-to-top button appears past the first screen.</div></Reveal>
            <Reveal delay={180}><div>These three lines used Reveal to fade and rise in sequence.</div></Reveal>
          </div>
        </Card>
      </div>
    </div>
  );
}

const PANELS = {
  colour: ColourPanel,
  typography: TypographyPanel,
  radii: RadiiPanel,
  spacing: SpacingPanel,
  buttons: ButtonsPanel,
  badges: BadgesPanel,
  cards: CardsPanel,
  motion: MotionPanel,
};

export default function DesignLibraryPage() {
  const { dark, toggle } = useTheme();
  const [tab, setTab] = useState('colour');

  useEffect(() => {
    const prev = document.title;
    document.title = 'Vellmont Design Library';
    return () => {
      document.title = prev;
    };
  }, []);

  const ActivePanel = PANELS[tab] || ColourPanel;

  return (
    <main className="min-h-screen bg-canvas text-ink font-sans antialiased">
      <GlobalSpotlight />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[13px] text-ink-2 hover:text-ink transition-colors">
              ← Vellmont
            </Link>
            <span className="text-line-strong">/</span>
            <span className="font-display font-semibold text-[14px] text-ink">Design Library</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-full bg-accent-soft text-accent text-[10px] font-mono uppercase tracking-wider">
              Internal
            </span>
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3 text-[12.5px] text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
            <span>{dark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* Compact hero */}
      <div className="border-b border-line bg-gradient-to-b from-surface-tint to-canvas">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-10 md:py-14">
          <div className={typography.monoLabel + ' mb-3'}>Vellmont Design System</div>
          <h1 className="font-display font-medium tracking-[-0.03em] leading-[1.05] text-3xl md:text-[40px] text-ink max-w-[760px]">
            The light-first{' '}
            <span className={typography.italicAccent}>component library</span>.
          </h1>
          <p className="mt-3 max-w-[620px] text-[15px] leading-[1.6] text-ink-2">
            The tokens, type scale and components behind vellmontservices.com.
            Light is the default; use the toggle to preview any tab in dark. This
            page renders the live tokens, so it stays true to the shipped site.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-40 border-b border-line bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div
            role="tablist"
            aria-label="Design library sections"
            className="flex gap-1 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {TABS.map((t, i) => {
              const active = tab === t.id;
              const showGroup = i === 0 || TABS[i - 1].group !== t.group;
              return (
                <React.Fragment key={t.id}>
                  {showGroup && (
                    <span className="shrink-0 self-center pl-2 pr-1 text-[10px] font-mono uppercase tracking-wider text-ink-3 first:pl-0">
                      {t.group}
                    </span>
                  )}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t.id)}
                    className={`relative shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-[13px] font-medium transition-colors ${
                      active
                        ? 'border-brand-500 text-ink'
                        : 'border-transparent text-ink-2 hover:text-ink'
                    }`}
                  >
                    {t.label}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active panel */}
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-16 min-h-[50vh]">
        <ActivePanel />
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[12px] text-ink-3">
            Vellmont Design Library · internal reference · not linked publicly
          </div>
          <Link
            to="/"
            className="text-[12px] text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            ← Back to vellmontservices.com
          </Link>
        </div>
      </footer>
    </main>
  );
}
