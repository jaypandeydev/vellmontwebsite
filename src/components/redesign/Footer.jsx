import React from 'react';
import { Link } from 'react-router-dom';

const cols = [
  {
    heading: 'Products',
    links: [
      { label: 'MedQuePMS', href: 'https://medquepms.vellmontservices.com', ext: true },
      { label: 'Vellroute', href: 'https://vellroute.com', ext: true },
      { label: 'InviteSync', href: 'https://invitesync.com', ext: true },
      { label: 'Vedjyotix', href: 'https://vedjyotix.com', ext: true },
      { label: 'Vellbill', href: 'https://vellbill.com', ext: true },
      { label: 'Tutora', href: 'https://tutorra.vellmontservices.com', ext: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/#thesis' },
      { label: 'Portfolio', href: '/#products-detail' },
      { label: 'AI Flows', href: '/#ai-flows' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Security', href: '/#security' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.08] mt-12">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="px-5 md:px-10 lg:px-20 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand col */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <img
                src="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
                alt="Vellmont"
                className="h-8 w-auto"
              />
              <span className="font-display font-medium text-[15px] text-white">
                Vellmont Services
              </span>
            </Link>
            <p className="text-[13px] text-slate-400 leading-[1.6] max-w-[320px] mb-5">
              An AI product company building production-grade vertical SaaS
              for healthcare, tourism, finance, education and everyday
              operations. Hyderabad · Dubai.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
              <span className="px-2 py-1 bg-white/[0.04] ring-1 ring-white/[0.08] rounded-md">
                India
              </span>
              <span className="px-2 py-1 bg-white/[0.04] ring-1 ring-white/[0.08] rounded-md">
                UAE
              </span>
              <span className="px-2 py-1 bg-white/[0.04] ring-1 ring-white/[0.08] rounded-md text-cyan-100">
                Taking new projects
              </span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-[13px] text-slate-300 hover:text-white transition-colors"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.ext ? '_blank' : undefined}
                        rel={l.ext ? 'noopener noreferrer' : undefined}
                        className="text-[13px] text-slate-300 hover:text-white transition-colors"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 border-t border-white/[0.06] text-[12px] text-slate-500">
          <div className="font-mono">
            © {year} Vellmont Services OPC PVT Ltd · VELLMONT IT SERVICES L.L.C
          </div>
          <div className="font-mono">
            Built in Hyderabad + Dubai · Bootstrapped
          </div>
        </div>
      </div>
    </footer>
  );
}
