import React from 'react';

// Shared country flag mark.
// Used anywhere the site names a country, city or market, so flags stay
// consistent instead of being hand-typed emoji in a dozen places.
//
//   <Flag code="in" />                  -> flag only
//   <Flag code="ae" label="Dubai" />    -> flag + label
//
// Emoji flags degrade gracefully: platforms without flag glyphs (Windows)
// render the two-letter country code, which still reads correctly.

const FLAGS = {
  in: { emoji: '🇮🇳', name: 'India' },
  ae: { emoji: '🇦🇪', name: 'United Arab Emirates' },
  us: { emoji: '🇺🇸', name: 'United States' },
};

export default function Flag({ code, label, className = '', size = 'text-[14px]' }) {
  const f = FLAGS[String(code).toLowerCase()];
  if (!f) return label ? <span className={className}>{label}</span> : null;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span role="img" aria-label={f.name} className={`${size} leading-none`}>
        {f.emoji}
      </span>
      {label && <span>{label}</span>}
    </span>
  );
}

export { FLAGS };
