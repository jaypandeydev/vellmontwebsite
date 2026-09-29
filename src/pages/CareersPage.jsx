import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Nav from '@/components/redesign/Nav';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';
import { typography } from '@/components/redesign/tokens';
import ApplicationForm from '@/components/careers/ApplicationForm';
import {
  BRANDS, DEPARTMENTS, TRACKED_QUERY_PARAMS, findRole, findBrand,
} from '../../shared/careersCatalog';

const cardBase =
  'rounded-2xl bg-white border border-[rgba(30,26,61,0.1)] hover:border-[rgba(30,26,61,0.2)] transition-colors shadow-[0_1px_2px_rgba(30,26,61,0.04)]';

const brandCards = [
  {
    slug: 'vellmont',
    name: 'Vellmont Services',
    logo: 'https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png',
    href: '/',
    ext: false,
    body: 'The studio. Custom software, AI builds and long-term product engineering for clinics, tour operators, tutors, freelancers and everyday businesses.',
    tint: 'bg-[#E3D9F5]',
  },
  {
    slug: 'vedjyotix',
    name: 'VedJyotix',
    logo: 'https://vedjyotix.com/favicon.svg',
    href: 'https://vedjyotix.com',
    ext: true,
    body: 'Astrology platform — Kundli, numerology, gun milan and a verified astrologer marketplace for chat and video consultations. Multilingual.',
    tint: 'bg-[#EAD9F3]',
  },
  {
    slug: 'medquepms',
    name: 'MedQuePMS',
    logo: 'https://medquepms.vellmontservices.com/favicon-32.png',
    href: 'https://medquepms.vellmontservices.com',
    ext: true,
    body: 'Clinic and hospital operating system for India — live queue, doctor workspace, AI pre-read, pharmacy, billing and a native patient app.',
    tint: 'bg-[#DDE2F0]',
  },
];

const expectations = [
  {
    n: '01',
    title: 'Categories, not vacancies',
    body: 'The roles below are the kinds of work we hire for across our brands. Not every category is open at every moment — submit your profile for current and future opportunities.',
  },
  {
    n: '02',
    title: 'One short form, no account',
    body: 'Tell us who you are, what you do, and attach your CV. It takes a few minutes and works fine on a phone.',
  },
  {
    n: '03',
    title: 'We read every application',
    body: 'Your CV goes straight to the hiring team and stays private. When a role matches, we reach out by email or phone.',
  },
];

function readQuery(searchParams) {
  const role = findRole(searchParams.get('role') || '');
  const brand = findBrand(searchParams.get('brand') || '');
  const attribution = {};
  for (const key of TRACKED_QUERY_PARAMS) {
    const v = (searchParams.get(key) || '').trim().slice(0, 200);
    if (v) attribution[key] = v;
  }
  if (role) attribution.landing_role = role.slug;
  if (brand) attribution.landing_brand = brand.slug;
  if (typeof document !== 'undefined' && document.referrer) attribution.referrer = document.referrer.slice(0, 500);
  return { role, brand, attribution };
}

const CareersPage = () => {
  const [searchParams] = useSearchParams();
  // Read once on mount: campaign links preselect a role/brand; junk values are ignored.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const query = useMemo(() => readQuery(searchParams), []);
  const [roleRequest, setRoleRequest] = useState(null);
  const [activeRole, setActiveRole] = useState(query.role ? query.role.slug : '');

  useEffect(() => {
    if (query.role) {
      const el = document.getElementById('apply');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
    }
  }, [query.role]);

  const chooseRole = (slug) => {
    setActiveRole(slug);
    setRoleRequest({ slug, nonce: Date.now() });
    const el = document.getElementById('apply');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const presetBanner = query.role ? (
    <div className="mb-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-[#5848F8]/10 text-[#3B2AD6] text-[13px] px-4 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Applying for</span>
      <span className="font-medium text-[#1E1A3D]">
        {query.role.label}
        {query.brand ? ` · ${query.brand.label}` : ''}
      </span>
      <span className="text-[#8F8AA0]">— you can change this below.</span>
    </div>
  ) : null;

  return (
    <main className="min-h-screen bg-[#F5EFE7] text-[#1E1A3D] font-sans antialiased">
      <Seo
        title="Careers at Vellmont — Vellmont Services, VedJyotix & MedQuePMS"
        description="Build your career with Vellmont. Submit your profile and CV for current and future roles across Vellmont Services, VedJyotix and MedQuePMS — engineering, QA, product & design, people & finance, customer & business, astrology, and internships."
        canonical="https://vellmontservices.com/careers"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pt-10 md:pt-16 pb-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-6 h-px bg-[#5848F8]" />
          <span className={typography.eyebrow}>Careers</span>
        </div>
        <h1 className={`${typography.sectionHeading} text-[#1E1A3D] max-w-[820px]`}>
          Build your <span className={typography.italicAccent}>career</span> with Vellmont
          <span className="text-[#1E1A3D]">.</span>
        </h1>
        <p className={`${typography.bodyLg} mt-6 max-w-[660px]`}>
          We&rsquo;re a small team building software for the people who keep
          clinics, astrology consultations, tours, classrooms and small businesses running.
          Opportunities span three brands: <strong className="font-medium text-[#1E1A3D]">Vellmont Services</strong>,{' '}
          <strong className="font-medium text-[#1E1A3D]">VedJyotix</strong> and{' '}
          <strong className="font-medium text-[#1E1A3D]">MedQuePMS</strong>.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-full bg-[#5848F8] text-white text-[14px] font-medium px-6 py-3.5 hover:bg-[#4736E4] transition-colors shadow-[0_10px_30px_-12px_rgba(88,72,248,0.55)]"
          >
            Submit your profile <span aria-hidden="true">↓</span>
          </a>
          <a
            href="#roles"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(30,26,61,0.14)] bg-white text-[#1E1A3D] text-[14px] font-medium px-5 py-3.5 hover:border-[rgba(30,26,61,0.3)] transition-colors"
          >
            See role categories
          </a>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-8">
        <div className={`${typography.monoLabel} mb-4`}>Where you&rsquo;d work</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brandCards.map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`${cardBase} p-6`}
            >
              <div className={`w-11 h-11 rounded-xl ${b.tint} grid place-items-center mb-4 overflow-hidden`}>
                <img src={b.logo} alt="" className="w-7 h-7 object-contain" loading="lazy" />
              </div>
              <div className="font-display text-[21px] tracking-tight text-[#1E1A3D] mb-2">{b.name}</div>
              <p className="text-[13.5px] leading-[1.6] text-[#4B4762] mb-4">{b.body}</p>
              <a
                href={b.href}
                target={b.ext ? '_blank' : undefined}
                rel={b.ext ? 'noopener noreferrer' : undefined}
                className="text-[13px] font-medium text-[#5848F8] hover:text-[#3B2AD6] transition-colors inline-flex items-center gap-1.5"
              >
                {b.ext ? 'visit site' : 'about the studio'} <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Expectations */}
      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-10">
        <div className="rounded-3xl bg-[#25204E] text-white px-6 md:px-10 py-8 md:py-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-[#E8B99A]" />
            <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-[#E8B99A]">How this works</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expectations.map((c) => (
              <div key={c.n} className="pt-3 border-t border-white/15">
                <div className="font-display text-[15px] text-[#E8B99A] mb-4">{c.n}</div>
                <div className="font-display text-[21px] leading-[1.15] mb-2">{c.title}</div>
                <div className="text-[14px] leading-[1.55] text-white/70">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role categories */}
      <section id="roles" className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-12 scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-px bg-[#5848F8]" />
          <span className={typography.eyebrow}>Role categories</span>
        </div>
        <h2 className="font-display font-normal tracking-[-0.02em] leading-[1.05] text-[30px] sm:text-[36px] md:text-[44px] text-[#1E1A3D] max-w-[720px]">
          Where you could fit<span className="text-[#5848F8]">.</span>
        </h2>
        <p className={`${typography.body} mt-4 max-w-[640px]`}>
          Pick the closest match and it will be preselected in the form. If nothing fits, choose
          &ldquo;Other / General Application&rdquo; and tell us what you do.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              className={`${cardBase} p-5 md:p-6`}
            >
              <div className="font-mono text-[10px] text-[#8F8AA0] mb-2 uppercase tracking-[0.18em]">
                {String(i + 1).padStart(2, '0')} · {d.roles.length} {d.roles.length === 1 ? 'category' : 'categories'}
              </div>
              <div className="font-display text-[20px] tracking-tight text-[#1E1A3D] mb-4">{d.label}</div>
              <ul className="flex flex-wrap gap-2" aria-label={`${d.label} roles`}>
                {d.roles.map((r) => {
                  const active = activeRole === r.slug;
                  return (
                    <li key={r.slug}>
                      <button
                        type="button"
                        onClick={() => chooseRole(r.slug)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${active ? 'bg-[#5848F8] border-[#5848F8] text-white' : 'bg-[#F5EFE7] border-[rgba(30,26,61,0.12)] text-[#1E1A3D] hover:border-[#5848F8] hover:text-[#3B2AD6]'}`}
                      >
                        {r.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-16 scroll-mt-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-px bg-[#5848F8]" />
          <span className={typography.eyebrow}>Apply</span>
        </div>
        <h2 className="font-display font-normal tracking-[-0.02em] leading-[1.05] text-[30px] sm:text-[36px] md:text-[44px] text-[#1E1A3D] max-w-[720px] mb-4">
          Submit your <span className={typography.italicAccent}>profile</span>
          <span className="text-[#5848F8]">.</span>
        </h2>
        {presetBanner}
        <p className={`${typography.body} max-w-[640px] mb-7`}>
          We only ask for what we need to consider you: your contact details, the role you&rsquo;re
          after, a little about your experience and your CV. Please don&rsquo;t include ID numbers,
          bank details or other sensitive documents.
        </p>
        <ApplicationForm
          preset={{ role: query.role ? query.role.slug : '', brand: query.brand ? query.brand.slug : '' }}
          attribution={query.attribution}
          roleRequest={roleRequest}
        />
        <p className="mt-6 text-[12.5px] text-[#8F8AA0] max-w-[640px] leading-[1.6]">
          Brands: {BRANDS.filter((b) => b.slug !== 'any').map((b) => b.label).join(' · ')}. Questions about
          an application you&rsquo;ve already sent? Write to{' '}
          <a href="mailto:support@vellmontservices.com" className="underline underline-offset-4 text-[#5848F8] hover:text-[#3B2AD6]">support@vellmontservices.com</a>{' '}
          with your reference.
        </p>
      </section>

      <Footer />
    </main>
  );
};

export default CareersPage;
