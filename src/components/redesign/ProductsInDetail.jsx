import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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

const GLOW_PER_CATEGORY = {
  healthcare: 'from-teal-500/25 via-cyan-500/15',
  astrology: 'from-fuchsia-500/25 via-violet-500/15',
  travel: 'from-amber-500/25 via-orange-500/15',
  education: 'from-emerald-500/25 via-teal-500/15',
  social: 'from-purple-500/25 via-fuchsia-500/15',
  finance: 'from-amber-500/25 via-yellow-500/15',
};

function ProductStrip({ product, idx }) {
  const c = colorCategories[product.category];
  const tonePill =
    TONE_PILL[product.category] || 'bg-white/[0.06] text-slate-300 ring-white/10';
  const glow = GLOW_PER_CATEGORY[product.category] || 'from-violet-500/25 via-cyan-500/15';
  const reverse = idx % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      {/* Banner with glow */}
      <div className="relative">
        <div
          className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${glow} to-transparent blur-3xl pointer-events-none scale-110`}
        />
        <a
          href={`https://${product.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] hover:ring-white/20 transition-all"
          style={{
            transform: reverse
              ? 'perspective(1400px) rotateY(3deg) rotateX(-1deg)'
              : 'perspective(1400px) rotateY(-3deg) rotateX(-1deg)',
          }}
        >
          <img
            src={product.banner}
            alt={`${product.name} ${product.suffix || ''} banner`}
            loading="lazy"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
          />
        </a>
      </div>

      {/* Copy column */}
      <div>
        <div className="flex items-center gap-2 mb-4">
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

        <p className={`${typography.bodyLg} mb-6 max-w-[540px]`}>
          {product.longDescription}
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mb-7 max-w-[540px]">
          {(product.features || product.tags || []).slice(0, 10).map((f) => (
            <span
              key={f}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] ring-1 ring-white/[0.08] text-slate-300 font-mono"
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
            className="group bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 hover:from-violet-400 hover:to-cyan-400 transition-all shadow-[0_8px_24px_-6px_rgba(124,58,237,0.55)]"
          >
            <span>Visit Product</span>
            <ArrowUpRight
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </a>
          <a
            href="#contact"
            className="group px-5 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
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
      className="relative px-5 md:px-10 lg:px-20 py-16 md:py-24"
    >
      <div className="mb-12 md:mb-16">
        <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/70 mb-3">
          The Portfolio
        </div>
        <h2 className={`${typography.sectionHeading} text-white max-w-[720px] mb-4`}>
          More than a flagship —{' '}
          <span className={typography.italicAccent}>a full portfolio.</span>
        </h2>
        <p className={`${typography.bodyLg} max-w-[680px]`}>
          Each product is a production application built for a specific
          industry. Same engineering bar, same AI-first defaults — different
          domain.
        </p>
      </div>

      <div className="space-y-20 md:space-y-28">
        {withBanners.map((p, i) => (
          <ProductStrip key={p.id} product={p} idx={i} />
        ))}
      </div>
    </section>
  );
}
