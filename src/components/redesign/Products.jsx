import React from 'react';
import { motion } from 'framer-motion';
import {
  flagshipProduct,
  mediumProducts,
  smallProducts,
  colorCategories,
  typography,
} from './tokens';

function SectionLabel({ left, right }) {
  return (
    <div className="flex justify-between items-baseline mb-5">
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {left}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {right}
      </div>
    </div>
  );
}

// Product mark — renders the hosted logo on a white icon tile (logos pop
// against the dark page), falling back to a category-tinted monogram badge.
function ProductMark({ product, color, size = 'md' }) {
  const [imgFailed, setImgFailed] = React.useState(false);

  const dims =
    size === 'lg'
      ? 'w-11 h-11 text-[18px] rounded-xl'
      : size === 'sm'
      ? 'w-8 h-8 text-[13px] rounded-lg'
      : 'w-9 h-9 text-[15px] rounded-lg';

  if (product.logo && !imgFailed) {
    return (
      <div
        className={`${dims} bg-white border border-white/15 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)]`}
      >
        <img
          src={product.logo}
          alt={`${product.name} logo`}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-1"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dims} ${color.pillBg} ${color.pillText} flex items-center justify-center font-mono font-semibold shrink-0`}
    >
      {product.name[0]}
    </div>
  );
}

const cardBase =
  'block rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all no-underline hover:bg-white/[0.05] hover:border-white/20';

export default function Products() {
  const flagshipColor = colorCategories[flagshipProduct.category];

  return (
    <section
      id="products"
      className="relative px-5 md:px-10 lg:px-20 py-12 md:py-16"
    >
      {/* Subtle gradient ambience for the section */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-gradient-to-r from-indigo-600/[0.06] via-violet-600/[0.06] to-emerald-500/[0.06] blur-3xl" />
      </div>

      <SectionLabel
        left="── WHAT WE'VE SHIPPED ─────"
        right="02/04 ──"
      />

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`${typography.sectionHeading} mb-6 text-white`}
      >
        Six products,{' '}
        <span className={`${typography.italicAccent} text-indigo-300`}>
          all in production.
        </span>
      </motion.h2>

      <motion.a
        href={`https://${flagshipProduct.domain}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className={`${cardBase} overflow-hidden mb-2`}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr]">
          <div className="p-6 md:p-7">
            <div className="flex items-center gap-3 mb-3">
              <ProductMark
                product={flagshipProduct}
                color={flagshipColor}
                size="lg"
              />
              <div className="flex gap-2 items-center flex-wrap">
                <span className="font-mono text-[11px] text-neutral-500">
                  /01 · FLAGSHIP
                </span>
                <span
                  className={`font-mono text-[10px] ${flagshipColor.pillBg} ${flagshipColor.pillText} px-2 py-0.5 rounded-full`}
                >
                  {flagshipColor.label}
                </span>
              </div>
            </div>
            <div className="text-2xl md:text-[28px] font-medium tracking-[-0.02em] mb-1 text-white">
              {flagshipProduct.name}
              {flagshipProduct.suffix && (
                <span className={flagshipColor.accent}>
                  {flagshipProduct.suffix}
                </span>
              )}
            </div>
            <div className="font-mono text-[12px] text-neutral-500 mb-3">
              {flagshipProduct.domain}
            </div>
            <p className="text-[13px] text-neutral-400 leading-[1.6] mb-3.5">
              {flagshipProduct.longDescription}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {flagshipProduct.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 bg-white/[0.06] ring-1 ring-inset ring-white/10 rounded font-mono text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={`${flagshipColor.bg} p-6 md:p-7 flex flex-col gap-1.5 border-l border-white/5`}>
            <div className={`font-mono text-[10px] ${flagshipColor.text} mb-1 opacity-80`}>
              live queue · dr. rao
            </div>
            <div
              className={`bg-white/[0.06] ring-1 ring-inset ring-white/10 px-3 py-2 rounded-md text-[11px] ${flagshipColor.text} flex justify-between`}
            >
              <span>A-104</span>
              <span className="text-emerald-400">in room</span>
            </div>
            <div
              className={`bg-white/[0.04] ring-1 ring-inset ring-white/5 px-3 py-2 rounded-md text-[11px] ${flagshipColor.text} opacity-70 flex justify-between`}
            >
              <span>A-105</span>
              <span>~4 min</span>
            </div>
            <div
              className={`bg-white/[0.03] ring-1 ring-inset ring-white/5 px-3 py-2 rounded-md text-[11px] ${flagshipColor.text} opacity-50 flex justify-between`}
            >
              <span>A-106</span>
              <span>~9 min</span>
            </div>
          </div>
        </div>
      </motion.a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        {mediumProducts.map((p, i) => {
          const c = colorCategories[p.category];
          return (
            <motion.a
              key={p.id}
              href={`https://${p.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`${cardBase} p-5 min-h-[140px] hover:-translate-y-0.5`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <ProductMark product={p} color={c} size="md" />
                  <span className="font-mono text-[10px] text-neutral-500">
                    /0{i + 2}
                  </span>
                </div>
                <span
                  className={`font-mono text-[9px] ${c.pillBg} ${c.pillText} px-2 py-0.5 rounded-full`}
                >
                  {c.label}
                </span>
              </div>
              <div className="font-medium text-[17px] tracking-[-0.01em] text-white">
                {p.name}
              </div>
              <div className="font-mono text-[11px] text-neutral-500 mb-2">
                {p.domain}
              </div>
              <p className="text-[12px] text-neutral-400 leading-[1.5]">
                {p.oneLiner}
              </p>
            </motion.a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {smallProducts.map((p, i) => {
          const c = colorCategories[p.category];
          return (
            <motion.a
              key={p.id}
              href={`https://${p.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`${cardBase} p-4 min-h-[120px] hover:-translate-y-0.5`}
            >
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center gap-2">
                  <ProductMark product={p} color={c} size="sm" />
                  <span className="font-mono text-[10px] text-neutral-500">
                    /0{i + 4}
                  </span>
                </div>
                <span
                  className={`font-mono text-[9px] ${c.pillBg} ${c.pillText} px-2 py-0.5 rounded-full`}
                >
                  {c.label}
                </span>
              </div>
              <div className="font-medium text-[14px] text-white">{p.name}</div>
              <div className="font-mono text-[10px] text-neutral-500 mt-0.5 mb-1.5">
                {p.domain}
              </div>
              <p className="text-[11px] text-neutral-400 leading-[1.5]">
                {p.oneLiner}
              </p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
