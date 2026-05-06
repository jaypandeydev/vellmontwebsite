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
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
        {left}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
        {right}
      </div>
    </div>
  );
}

export default function Products() {
  const flagshipColor = colorCategories[flagshipProduct.category];

  return (
    <section
      id="products"
      className="bg-neutral-50 px-5 md:px-10 lg:px-20 py-8 md:py-10"
    >
      <SectionLabel
        left="── WHAT WE'VE SHIPPED ─────"
        right="02/04 ──"
      />

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`${typography.sectionHeading} mb-6`}
      >
        Six products,{' '}
        <span className={typography.italicAccent}>all in production.</span>
      </motion.h2>

      <motion.a
        href={`https://${flagshipProduct.domain}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="block bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-2 hover:border-neutral-300 transition-colors no-underline"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr]">
          <div className="p-6 md:p-7">
            <div className="flex gap-2 items-center mb-2.5">
              <span className="font-mono text-[11px] text-neutral-400">
                /01 · FLAGSHIP
              </span>
              <span
                className={`font-mono text-[10px] ${flagshipColor.pillBg} ${flagshipColor.pillText} px-2 py-0.5 rounded-full`}
              >
                {flagshipColor.label}
              </span>
            </div>
            <div className="text-2xl md:text-[28px] font-medium tracking-[-0.02em] mb-1">
              {flagshipProduct.name}
              {flagshipProduct.suffix && (
                <span className={flagshipColor.accent}>
                  {flagshipProduct.suffix}
                </span>
              )}
            </div>
            <div className="font-mono text-[12px] text-neutral-400 mb-3">
              {flagshipProduct.domain}
            </div>
            <p className="text-[13px] text-neutral-600 leading-[1.55] mb-3.5">
              {flagshipProduct.longDescription}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {flagshipProduct.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 bg-neutral-100 rounded font-mono text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={`${flagshipColor.bg} p-6 md:p-7 flex flex-col gap-1.5`}>
            <div className={`font-mono text-[10px] ${flagshipColor.text} mb-1`}>
              live queue · dr. rao
            </div>
            <div
              className={`bg-white px-3 py-2 rounded-md text-[11px] ${flagshipColor.text} flex justify-between`}
            >
              <span>A-104</span>
              <span className="text-emerald-600">in room</span>
            </div>
            <div
              className={`bg-white px-3 py-2 rounded-md text-[11px] ${flagshipColor.text} opacity-70 flex justify-between`}
            >
              <span>A-105</span>
              <span>~4 min</span>
            </div>
            <div
              className={`bg-white px-3 py-2 rounded-md text-[11px] ${flagshipColor.text} opacity-50 flex justify-between`}
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
              className="block bg-white rounded-2xl border border-neutral-200 p-5 min-h-[140px] hover:border-neutral-300 hover:-translate-y-0.5 transition-all no-underline"
            >
              <div className="flex justify-between items-start mb-2.5">
                <span className="font-mono text-[10px] text-neutral-400">
                  /0{i + 2}
                </span>
                <span
                  className={`font-mono text-[9px] ${c.pillBg} ${c.pillText} px-2 py-0.5 rounded-full`}
                >
                  {c.label}
                </span>
              </div>
              <div className="font-medium text-[17px] tracking-[-0.01em] text-neutral-900">
                {p.name}
              </div>
              <div className="font-mono text-[11px] text-neutral-400 mb-2">
                {p.domain}
              </div>
              <p className="text-[12px] text-neutral-600 leading-[1.5]">
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
              className="block bg-white rounded-2xl border border-neutral-200 p-4 min-h-[120px] hover:border-neutral-300 hover:-translate-y-0.5 transition-all no-underline"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-neutral-400">
                  /0{i + 4}
                </span>
                <span
                  className={`font-mono text-[9px] ${c.pillBg} ${c.pillText} px-2 py-0.5 rounded-full`}
                >
                  {c.label}
                </span>
              </div>
              <div className="font-medium text-[14px] text-neutral-900">{p.name}</div>
              <div className="font-mono text-[10px] text-neutral-400 mt-0.5 mb-1.5">
                {p.domain}
              </div>
              <p className="text-[11px] text-neutral-600 leading-[1.5]">
                {p.oneLiner}
              </p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
