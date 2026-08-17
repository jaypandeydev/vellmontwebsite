import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useActiveSection, useAutoHideHeader } from './interactions';

const links = [
  { label: 'Portfolio', href: '/#products-detail' },
  { label: 'AI Flows', href: '/#ai-flows' },
  { label: 'Technology', href: '/#tech' },
  { label: 'Security', href: '/#security' },
];

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

const SECTION_IDS = ['products-detail', 'ai-flows', 'tech', 'security'];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const activeSection = useActiveSection(SECTION_IDS);
  const navRef = useRef(null);
  // Hide on scroll down, reveal on scroll up. Stays put while the menu is open.
  useAutoHideHeader(navRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-md will-change-transform"
    >
      <div className="px-5 md:px-10 lg:px-20 py-3.5 flex justify-between items-center text-[13px]">
        <Link to="/" onClick={close} className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
            alt="Vellmont"
            className="h-8 w-auto"
          />
          <span className="font-display font-semibold text-[14px] text-ink whitespace-nowrap">
            Vellmont
            <span className="hidden sm:inline text-brand-600 dark:text-brand-400">Services</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2 text-ink-2">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                aria-current={activeSection && l.href.endsWith(activeSection) ? 'true' : undefined}
                className={`relative px-3 py-1.5 rounded-md transition-colors ${
                  activeSection && l.href.endsWith(activeSection)
                    ? 'text-ink'
                    : 'hover:text-ink hover:bg-surface-2'
                }`}
              >
                {l.label}
                {activeSection && l.href.endsWith(activeSection) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />
                )}
              </a>
            ))}
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-md hover:text-ink hover:bg-surface-2 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Primary CTA */}
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="u-press ml-1 hidden sm:flex items-center gap-1.5 whitespace-nowrap rounded-md bg-brand-500 px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-brand-600 md:ml-2 md:px-3.5"
          >
            <span>Book a demo</span>
            <span aria-hidden="true">→</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="md:hidden fixed inset-0 top-[57px] z-40 bg-black/30"
          />
          <div
            id="mobile-menu"
            className="md:hidden absolute inset-x-0 top-full z-50 border-b border-line bg-canvas shadow-lg"
          >
            <div className="px-5 py-3 flex flex-col">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={close}
                  className="rounded-md px-3 py-3 text-[15px] text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/contact"
                onClick={close}
                className="rounded-md px-3 py-3 text-[15px] text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
              >
                Contact
              </Link>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand-600"
              >
                <span>Book a demo</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
