import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Portfolio', href: '/#products-detail' },
  { label: 'AI Flows', href: '/#ai-flows' },
  { label: 'Technology', href: '/#tech' },
  { label: 'Security', href: '/#security' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock body scroll while the mobile menu is open.
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
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05070d]/88 backdrop-blur-md">
      <div className="px-5 md:px-10 lg:px-20 py-3.5 flex justify-between items-center text-[13px]">
        <Link to="/" onClick={close} className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
            alt="Vellmont"
            className="h-8 w-auto"
          />
          <span className="font-display font-medium text-[14px] text-white whitespace-nowrap">
            Vellmont
            <span className="hidden sm:inline text-cyan-100">Services</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2 text-slate-400">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Primary CTA: now visible on mobile too */}
          <a
            href="#contact"
            onClick={close}
            className="ml-1 flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#07111f] transition-colors hover:bg-cyan-100 md:ml-3 md:px-3.5"
          >
            <span>Book Demo</span>
            <span aria-hidden="true">→</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <>
          {/* backdrop */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="md:hidden fixed inset-0 top-[57px] z-40 bg-black/40"
          />
          <div
            id="mobile-menu"
            className="md:hidden absolute inset-x-0 top-full z-50 border-b border-white/[0.08] bg-[#05070d] shadow-2xl shadow-black/60"
          >
            <div className="px-5 py-3 flex flex-col">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={close}
                  className="rounded-md px-3 py-3 text-[15px] text-slate-200 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/contact"
                onClick={close}
                className="rounded-md px-3 py-3 text-[15px] text-slate-200 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Contact
              </Link>
              <a
                href="#contact"
                onClick={close}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-white px-4 py-3 text-[15px] font-medium text-[#07111f] transition-colors hover:bg-cyan-100"
              >
                <span>Book Demo</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
