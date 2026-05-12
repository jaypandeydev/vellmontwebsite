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
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
        {left}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
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
      <h2 className={`${typography.sectionHeading} mb-3 text-neutral-900`}>
        {title}
      </h2>
      <div className="prose-neutral max-w-[760px] text-[14px] leading-[1.7] text-neutral-700 space-y-3">
        {children}
      </div>
    </motion.section>
  );
}

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <Seo
        title="Privacy Policy — Vellmont Services"
        description="How Vellmont Services collects, uses, and protects information from visitors and customers across our website and products."
        canonical="https://vellmontservices.com/privacy-policy"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />

      <section className="px-5 md:px-10 lg:px-20 pt-8 md:pt-12 pb-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          <span>PRIVACY POLICY</span>
          <span>LAST UPDATED · {LAST_UPDATED}</span>
        </div>
        <h1 className={`${typography.displayHeadline} max-w-[640px] mb-5 text-neutral-900`}>
          How we handle your <span className={typography.italicAccent}>data</span>.
        </h1>
        <p className="text-[15px] leading-[1.6] text-neutral-600 max-w-[680px]">
          This policy explains what information Vellmont Services collects, how
          we use it, who we share it with, and what control you have over it.
          It applies to vellmontservices.com and the products listed on the
          homepage.
        </p>
      </section>

      <Section id="who-we-are" label="── 01 · WHO WE ARE ────────" count="01/08 ──" title="Who we are">
        <p>
          Vellmont Services is operated by <strong>Vellmont Services OPC PVT
          Ltd</strong> (registered in India) and <strong>VELLMONT IT SERVICES
          L.L.C</strong> (registered in the UAE). When this policy refers to
          "we", "us", or "our", it refers to both entities collectively.
          Contact details are at the bottom of this page.
        </p>
      </Section>

      <Section id="what-we-collect" label="── 02 · DATA WE COLLECT ───" count="02/08 ──" title="What we collect">
        <p>We collect only what we need to run the site and respond to you:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Information you give us:</strong> name, email, message
            content, and any other details you submit through our contact
            form, email, or phone.
          </li>
          <li>
            <strong>Information collected automatically:</strong> standard web
            server logs (IP address, user agent, referrer, timestamps) for
            security and debugging.
          </li>
          <li>
            <strong>Cookies:</strong> only essential cookies required for the
            site to function. We do not currently use third-party analytics
            or advertising cookies on vellmontservices.com.
          </li>
        </ul>
      </Section>

      <Section id="how-we-use" label="── 03 · HOW WE USE IT ─────" count="03/08 ──" title="How we use it">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>To respond to inquiries you send us.</li>
          <li>To deliver the services you request.</li>
          <li>To improve the site and our products.</li>
          <li>To meet legal, accounting, and regulatory obligations.</li>
        </ul>
      </Section>

      <Section id="third-parties" label="── 04 · THIRD PARTIES ─────" count="04/08 ──" title="Third-party services">
        <p>
          Some pages load resources from third-party providers, which may set
          cookies or log requests under their own terms:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Google Fonts — for typography (Inter, Instrument Serif, JetBrains Mono).</li>
          <li>Cloudinary — for hosting our logo and images.</li>
          <li>Caddy / our VPS host — for serving the site.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>
      </Section>

      <Section id="retention" label="── 05 · RETENTION ─────────" count="05/08 ──" title="How long we keep data">
        <p>
          We retain contact-form submissions and email correspondence for as
          long as needed to respond and for a reasonable record-keeping
          period afterward (typically up to 24 months). Server logs are
          rotated within 30 days unless retained for a specific security
          investigation.
        </p>
      </Section>

      <Section id="rights" label="── 06 · YOUR RIGHTS ───────" count="06/08 ──" title="Your rights">
        <p>
          Subject to applicable law (including India's Digital Personal Data
          Protection Act and the UAE PDPL, and where relevant the EU GDPR),
          you have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Request deletion of your data, subject to legal exceptions.</li>
          <li>Withdraw consent where processing is based on consent.</li>
          <li>Lodge a complaint with the relevant data-protection authority.</li>
        </ul>
        <p>
          To exercise any of these rights, email{' '}
          <a href="mailto:support@vellmontservices.com" className="underline underline-offset-4">support@vellmontservices.com</a>.
        </p>
      </Section>

      <Section id="security" label="── 07 · SECURITY ──────────" count="07/08 ──" title="Security">
        <p>
          We use HTTPS for all site traffic and follow industry-standard
          practices to protect the data we hold. No system is perfectly
          secure; if you believe your data has been affected, please contact
          us immediately.
        </p>
      </Section>

      <Section id="changes-and-contact" label="── 08 · CHANGES & CONTACT ─" count="08/08 ──" title="Changes to this policy & contact">
        <p>
          We may update this policy from time to time. The "Last updated"
          date at the top of the page reflects the most recent revision.
        </p>
        <p>
          Questions about this policy or our data practices? Reach us at:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Email:{' '}
            <a href="mailto:support@vellmontservices.com" className="underline underline-offset-4">support@vellmontservices.com</a>
          </li>
          <li>India office: WeWork Rajapushpa Summit, Financial District, Hyderabad, Telangana 500032</li>
          <li>UAE office: Rigga Business Centre-3001, Al Murqabat, Dubai</li>
        </ul>
      </Section>

      <Footer />
    </main>
  );
};

export default PrivacyPolicyPage;
