import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';

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
      { label: 'Vellpass', href: 'https://vellpass.vellmontservices.com', ext: true },
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
    <footer className="relative border-t border-line mt-12">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
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
              <span className="font-display font-medium text-[15px] text-ink">
                Vellmont Services
              </span>
            </Link>
            <p className="text-[13px] text-ink-3 leading-[1.6] max-w-[320px] mb-5">
              An AI-powered SaaS company building enterprise software across
              healthcare, logistics, finance, business automation and consumer
              AI. Hyderabad · Dubai.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-ink-3">
              <span className="px-2 py-1 bg-surface-2 ring-1 ring-line rounded-md">
                India
              </span>
              <span className="px-2 py-1 bg-surface-2 ring-1 ring-line rounded-md">
                UAE
              </span>
              <span className="px-2 py-1 bg-surface-2 ring-1 ring-line rounded-md text-brand-600 dark:text-brand-400">
                Taking new projects
              </span>
            </div>

            {/* Social */}
            <div className="mt-5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mb-3">
                Follow us
              </div>
              <div className="flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  const base =
                    'w-9 h-9 rounded-md ring-1 flex items-center justify-center transition-colors';
                  if (s.live) {
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className={`${base} bg-surface-2 ring-line text-ink-2 hover:text-ink hover:bg-surface-2 hover:ring-line-strong`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.6} />
                      </a>
                    );
                  }
                  return (
                    <span
                      key={s.label}
                      aria-label={`${s.label}, coming soon`}
                      title={`${s.label}, coming soon`}
                      className={`${base} bg-surface ring-line text-ink-3 cursor-not-allowed`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.6} />
                    </span>
                  );
                })}
              </div>
              <div className="text-[11px] font-mono text-ink-3 mt-2">
                X coming soon
              </div>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-[13px] text-ink-2 hover:text-ink transition-colors"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.ext ? '_blank' : undefined}
                        rel={l.ext ? 'noopener noreferrer' : undefined}
                        className="text-[13px] text-ink-2 hover:text-ink transition-colors"
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 border-t border-line text-[12px] text-ink-3">
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
