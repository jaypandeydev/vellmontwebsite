import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const CALENDLY_URL = 'https://calendly.com/finance-vellmontservices/';

const links = [
  { label: 'Our products', href: '/#portfolio' },
  { label: 'Services', href: '/#services' },
  { label: 'How we work', href: '/#how-we-work' },
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
    <nav className="sticky top-0 z-50 bg-[#F5EFE7]/85 backdrop-blur-md border-b border-[rgba(30,26,61,0.06)]">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10 lg:px-14 py-4 flex items-center justify-between">
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2.5 shrink-0"
          aria-label="Vellmont Services home"
        >
          <img
            src="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
            alt="Vellmont Services"
            className="h-9 w-auto"
          />
          <span className="hidden sm:inline font-display font-semibold text-[18px] text-[#1E1A3D] tracking-tight">
            Vellmont<span className="text-[#5848F8]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 text-[14px] text-[#4B4762]">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3.5 py-2 rounded-full hover:text-[#1E1A3D] hover:bg-[rgba(30,26,61,0.05)] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/contact"
              className="px-3.5 py-2 rounded-full hover:text-[#1E1A3D] hover:bg-[rgba(30,26,61,0.05)] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Primary CTA — visible on mobile too, wired to Calendly */}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="ml-1 md:ml-3 group inline-flex items-center gap-1.5 rounded-full bg-[#1E1A3D] text-white text-[13px] md:text-[13.5px] font-medium px-4 md:px-5 py-2.5 hover:bg-[#2A2452] transition-colors"
          >
            <span>Book a demo</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#4B4762] hover:text-[#1E1A3D] hover:bg-[rgba(30,26,61,0.06)] transition-colors"
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
            className="md:hidden fixed inset-0 top-[65px] z-40 bg-[#1E1A3D]/25"
          />
          <div
            id="mobile-menu"
            className="md:hidden absolute inset-x-0 top-full z-50 border-b border-[rgba(30,26,61,0.08)] bg-[#F5EFE7] shadow-xl shadow-[#1E1A3D]/10"
          >
            <div className="px-5 py-4 flex flex-col">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={close}
                  className="rounded-md px-3 py-3 text-[15px] text-[#1E1A3D] hover:bg-[rgba(30,26,61,0.05)] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/contact"
                onClick={close}
                className="rounded-md px-3 py-3 text-[15px] text-[#1E1A3D] hover:bg-[rgba(30,26,61,0.05)] transition-colors"
              >
                Contact
              </Link>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-[#1E1A3D] text-white text-[15px] font-medium px-5 py-3 hover:bg-[#2A2452] transition-colors"
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
