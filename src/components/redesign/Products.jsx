import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { products, colorCategories, typography } from './tokens';

function ProductLogo({ p, c }) {
  const [failed, setFailed] = useState(false);
  if (p.logo && !failed) {
    return (
      <span
        className={`w-10 h-10 rounded-xl bg-white grid place-items-center overflow-hidden ${
          p.logoBleed ? '' : 'p-1.5'
        } ring-1 ring-black/5 shadow-[0_1px_2px_rgba(30,26,61,0.06)]`}
      >
        <img
          src={p.logo}
          alt={`${p.displayName || p.name} logo`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={p.logoBleed ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'}
        />
      </span>
    );
  }
  return (
    <span
      className={`w-10 h-10 rounded-xl bg-white grid place-items-center font-mono text-[12px] font-semibold ring-1 ring-black/5 shadow-[0_1px_2px_rgba(30,26,61,0.06)] ${c.ink}`}
    >
      {p.initials}
    </span>
  );
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'travel', label: 'Travel' },
  { id: 'finance', label: 'Finance' },
  { id: 'people', label: 'People' },
];

const PEOPLE_CATS = new Set([
  'social',
  'security',
  'education',
  'astrology',
]);

function ProductCard({ p, i }) {
  const c = colorCategories[p.category] || colorCategories.healthcare;
  const displayName = p.displayName || `${p.name}${p.suffix || ''}`;
  return (
    <motion.a
      href={`https://${p.domain}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
      className="group block rounded-2xl bg-white border border-[rgba(30,26,61,0.08)] hover:border-[rgba(30,26,61,0.18)] transition-colors overflow-hidden shadow-[0_1px_2px_rgba(30,26,61,0.04)]"
    >
      {/* Coloured metric panel */}
      <div className={`${c.bg} p-5 md:p-6 min-h-[172px] flex flex-col`}>
        <div className="flex items-center justify-between mb-4">
          <ProductLogo p={p} c={c} />
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] ${c.inkMuted}`}
          >
            Live product <span aria-hidden="true">↗</span>
          </span>
        </div>

        <div className="mt-auto rounded-xl bg-white/60 backdrop-blur-sm p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className={`font-display text-[26px] leading-none ${c.ink}`}>
              {p.metric?.value}
            </span>
            <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${c.inkMuted}`}>
              {p.metricSecondary?.label || p.metric?.hint}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[11px] font-mono uppercase tracking-[0.14em] ${c.inkMuted}`}>
              {p.metric?.label}
            </span>
            <span className={`text-[12px] font-medium ${c.ink}`}>
              {p.metricSecondary?.value || p.metric?.hint}
            </span>
          </div>
        </div>
      </div>

      {/* White body */}
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-[18px] text-[#1E1A3D] tracking-tight">
            {displayName}
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-[0.18em] ${c.inkMuted}`}>
            {c.label}
          </span>
        </div>
        <p className="text-[13.5px] leading-[1.5] text-[#4B4762]">
          {p.oneLiner}
        </p>
      </div>
    </motion.a>
  );
}

export default function Products() {
  const [filter, setFilter] = useState('all');

  const visible = useMemo(() => {
    if (filter === 'all') return products;
    if (filter === 'people') return products.filter((p) => PEOPLE_CATS.has(p.category));
    return products.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section
      id="portfolio"
      className="relative px-5 md:px-10 lg:px-14 py-8 md:py-10"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-px bg-[#5848F8]" />
          <span className={typography.eyebrow}>The portfolio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 items-end mb-6">
          <h2 className={`${typography.sectionHeading} text-[#1E1A3D]`}>
            Tools with a{' '}
            <span className={typography.italicAccent}>job to do</span>
            <span className="text-[#1E1A3D]">.</span>
          </h2>
          <p className="text-[15px] leading-[1.55] text-[#4B4762] max-w-[380px] md:justify-self-end">
            Each product starts close to an operator and grows from the details they
            cannot afford to lose.
          </p>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-[rgba(30,26,61,0.1)]">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                filter === f.id
                  ? 'bg-[#5848F8] text-white'
                  : 'text-[#4B4762] hover:bg-[rgba(30,26,61,0.06)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {visible.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
