import React from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/redesign/Nav';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';
import { typography } from '@/components/redesign/tokens';

const LAST_UPDATED = 'May 2026';

function SectionLabel({ left, right }) {
  return (
    <div className="flex justify-between items-baseline mb-4">
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {left}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {right}
      </div>
    </div>
  );
}

function Section({ id, label, count, title, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="px-5 md:px-10 lg:px-20 pb-8"
    >
      <SectionLabel left={label} right={count} />
      <h2 className={`${typography.sectionHeading} mb-3 text-white`}>
        {title}
      </h2>
      <div className="max-w-[760px] text-[14px] leading-[1.7] text-neutral-300 space-y-3">
        {children}
      </div>
    </motion.section>
  );
}

const TermsPage = () => {
  return (
    <main className="min-h-screen bg-[#050816] text-neutral-100 font-sans antialiased">
      <Seo
        title="Terms of Service — Vellmont Services"
        description="The terms that govern your use of vellmontservices.com and the products and services Vellmont Services offers."
        canonical="https://vellmontservices.com/terms"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />

      <section className="px-5 md:px-10 lg:px-20 pt-8 md:pt-12 pb-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          <span>TERMS OF SERVICE</span>
          <span>LAST UPDATED · {LAST_UPDATED}</span>
        </div>
        <h1 className={`${typography.displayHeadline} max-w-[640px] mb-5 text-white`}>
          The rules of the{' '}
          <span className={`${typography.italicAccent}`}>
            road
          </span>
          .
        </h1>
        <p className="text-[15px] leading-[1.6] text-neutral-400 max-w-[680px]">
          By using vellmontservices.com or any Vellmont Services product, you
          agree to these terms. Please read them — they're meant to be plain
          English, not lawyer-speak.
        </p>
      </section>

      <Section id="acceptance" label="── 01 · ACCEPTANCE ────────" count="01/08 ──" title="Acceptance of terms">
        <p>
          These Terms of Service ("Terms") form a legal agreement between you
          and <strong>Vellmont Services OPC PVT Ltd</strong> (India) and{' '}
          <strong>VELLMONT IT SERVICES L.L.C</strong> (UAE) (together,
          "Vellmont", "we", "us"). By accessing or using our website or
          products you accept these Terms; if you do not agree, do not use
          the site or products.
        </p>
      </Section>

      <Section id="services" label="── 02 · SERVICES ──────────" count="02/08 ──" title="The services we provide">
        <p>
          Vellmont operates this marketing website and a portfolio of
          software products (currently MedQuePMS, Vedjyotix, Vellroute,
          Tutora, InviteSync, and Vellbill) and offers custom software
          development. Each product may have its own additional terms; where
          there is a conflict, the product-specific terms apply for that
          product.
        </p>
      </Section>

      <Section id="acceptable-use" label="── 03 · ACCEPTABLE USE ────" count="03/08 ──" title="Acceptable use">
        <p>You agree not to use the site or our services to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Violate any applicable law or regulation.</li>
          <li>Infringe any intellectual property or other rights.</li>
          <li>Interfere with or disrupt the services or the underlying infrastructure.</li>
          <li>Attempt to gain unauthorised access to any account or system.</li>
          <li>Send spam, malware, or other harmful content.</li>
        </ul>
      </Section>

      <Section id="ip" label="── 04 · INTELLECTUAL PROP ─" count="04/08 ──" title="Intellectual property">
        <p>
          All content on this site — including the Vellmont name and logo,
          product names, copy, and design — is owned by Vellmont or its
          licensors and is protected by intellectual-property law. You may
          not copy, reproduce, or create derivative works without written
          permission, except for normal browsing and personal reference.
        </p>
        <p>
          For custom development engagements, IP ownership is governed by
          the signed agreement for that engagement.
        </p>
      </Section>

      <Section id="disclaimer" label="── 05 · DISCLAIMER ────────" count="05/08 ──" title="Disclaimer of warranties">
        <p>
          The site and our services are provided <strong>"as is"</strong> and{' '}
          <strong>"as available"</strong>, without warranty of any kind,
          express or implied, including warranties of merchantability,
          fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          We do not warrant that the site will be uninterrupted, error-free,
          or free of viruses or other harmful components.
        </p>
      </Section>

      <Section id="liability" label="── 06 · LIABILITY ─────────" count="06/08 ──" title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, Vellmont and its officers,
          employees, and partners will not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising
          from your use of the site or services.
        </p>
        <p>
          Our total aggregate liability for any claim arising out of or
          related to these Terms is limited to the amount you have paid us
          in the twelve (12) months preceding the claim, or INR 10,000,
          whichever is greater.
        </p>
      </Section>

      <Section id="governing-law" label="── 07 · GOVERNING LAW ─────" count="07/08 ──" title="Governing law & disputes">
        <p>
          These Terms are governed by the laws of India. Any dispute arising
          out of or in connection with these Terms will be subject to the
          exclusive jurisdiction of the courts located in Hyderabad,
          Telangana, unless local law in your jurisdiction requires otherwise.
        </p>
      </Section>

      <Section id="changes-and-contact" label="── 08 · CHANGES & CONTACT ─" count="08/08 ──" title="Changes to these terms & contact">
        <p>
          We may update these Terms from time to time. The "Last updated"
          date at the top of this page reflects the most recent revision.
          Continued use of the site or services after a change means you
          accept the revised Terms.
        </p>
        <p>
          Questions? Reach us at:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Email:{' '}
            <a href="mailto:support@vellmontservices.com" className="underline underline-offset-4 text-indigo-300 hover:text-indigo-200 transition-colors">support@vellmontservices.com</a>
          </li>
          <li>India office: WeWork Rajapushpa Summit, Financial District, Hyderabad, Telangana 500032</li>
          <li>UAE office: No. 3001-586, Artco Marlin Investment LLC, Al Muraqqabat, Deira, Dubai</li>
        </ul>
      </Section>

      <Footer />
    </main>
  );
};

export default TermsPage;
