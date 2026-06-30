import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Portfolio', href: '/#products-detail' },
  { label: 'AI Flows', href: '/#ai-flows', mobileHide: true },
  { label: 'Technology', href: '/#tech', mobileHide: true },
  { label: 'Security', href: '/#security', mobileHide: true },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05070d]/88 backdrop-blur-md">
      <div className="px-5 md:px-10 lg:px-20 py-3.5 flex justify-between items-center text-[13px]">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
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
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.04] transition-colors ${
                  l.mobileHide ? 'hidden lg:inline-flex' : ''
                }`}
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

          {/* CTA */}
          <a
            href="#contact"
            className="ml-1 hidden items-center gap-1.5 rounded-md bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#07111f] transition-colors hover:bg-cyan-100 sm:flex md:ml-3"
          >
            <span>Book Demo</span>
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}
