import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';

const CALENDLY_URL = 'https://calendly.com/finance-vellmontservices/';

const cols = [
  {
    heading: 'Products',
    links: [
      { label: 'MedQuePMS', href: 'https://medquepms.vellmontservices.com', ext: true },
      { label: 'Vellroute', href: 'https://vellroute.com', ext: true },
      { label: 'Vedjyotix', href: 'https://vedjyotix.com', ext: true },
      { label: 'InviteSync', href: 'https://invitesync.com', ext: true },
      { label: 'Vellbill', href: 'https://vellbill.com', ext: true },
      { label: 'Tutora', href: 'https://tutorra.vellmontservices.com', ext: true },
      { label: 'Vellpass', href: 'https://vellpass.vellmontservices.com', ext: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Our products', href: '/#portfolio' },
      { label: 'Services', href: '/#services' },
      { label: 'How we work', href: '/#how-we-work' },
      { label: 'Book a demo', href: CALENDLY_URL, ext: true },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/vellmont-services',
    icon: Linkedin,
    live: true,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61589398604871',
    icon: Facebook,
    live: true,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/vellmontservices/',
    icon: Instagram,
    live: true,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@VellmontServices',
    icon: Youtube,
    live: true,
  },
  { label: 'X', href: null, icon: Twitter, live: false },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(30,26,61,0.1)] bg-[#F5EFE7]">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10 lg:px-14 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand col */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4" aria-label="Vellmont Services home">
              <img
                src="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
                alt="Vellmont Services"
                className="h-9 w-auto"
              />
              <span className="font-display font-semibold text-[17px] text-[#1E1A3D] tracking-tight">
                Vellmont Services
              </span>
            </Link>
            <p className="text-[13px] leading-[1.55] text-[#4B4762] max-w-[320px] mb-6">
              Focused, production-ready software for the people keeping healthcare,
              travel, finance, education, and everyday business moving.
            </p>

            {/* Region + status pills */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#6B667E] mb-6">
              <span className="px-2 py-1 rounded-md border border-[rgba(30,26,61,0.1)]">
                India
              </span>
              <span className="px-2 py-1 rounded-md border border-[rgba(30,26,61,0.1)]">
                UAE
              </span>
              <span className="px-2 py-1 rounded-md border border-[rgba(30,26,61,0.1)]">
                USA
              </span>
              <span className="px-2 py-1 rounded-md border border-[#3B7A4E]/30 bg-[#D8E8DA] text-[#1F3B26] inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B7A4E]" />
                Taking new projects
              </span>
            </div>

            {/* Social */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8F8AA0] mb-3">
                Follow us
              </div>
              <div className="flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  const base =
                    'w-9 h-9 rounded-full grid place-items-center border transition-colors';
                  if (s.live) {
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className={`${base} bg-white border-[rgba(30,26,61,0.12)] text-[#4B4762] hover:text-[#1E1A3D] hover:border-[rgba(30,26,61,0.28)]`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.6} />
                      </a>
                    );
                  }
                  return (
                    <span
                      key={s.label}
                      aria-label={`${s.label} — coming soon`}
                      title={`${s.label} — coming soon`}
                      className={`${base} bg-transparent border-[rgba(30,26,61,0.08)] text-[#B7B4C2] cursor-not-allowed`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.6} />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8F8AA0] mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-[13.5px] text-[#4B4762] hover:text-[#1E1A3D] transition-colors"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.ext ? '_blank' : undefined}
                        rel={l.ext ? 'noopener noreferrer' : undefined}
                        className="text-[13.5px] text-[#4B4762] hover:text-[#1E1A3D] transition-colors"
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 border-t border-[rgba(30,26,61,0.08)] text-[12px] text-[#8F8AA0]">
          <div>
            © {year} Vellmont Services OPC PVT Ltd · VELLMONT IT SERVICES L.L.C
          </div>
          <div className="flex items-center gap-4">
            <span>Independent · Remote-first</span>
            <span className="hidden md:inline text-[#B7B4C2]">Focused software for real operators.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
