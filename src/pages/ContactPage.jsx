import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Nav from '@/components/redesign/Nav';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';
import { typography } from '@/components/redesign/tokens';

const CALENDLY_URL = 'https://calendly.com/finance-vellmontservices/';

const offices = [
  {
    company: 'VELLMONT IT SERVICES L.L.C',
    lines: [
      'No. 3001-586, Artco Marlin Investment LLC',
      'Al Muraqqabat, Deira',
      'Dubai, UAE',
    ],
    mapUrl: 'https://maps.app.goo.gl/fUaPtF2UWsYZ3KWUA',
    locationLabel: 'Dubai',
  },
  {
    company: 'Vellmont Services OPC PVT Ltd',
    lines: [
      'WeWork Rajapushpa Summit, SY. 130P & 115/1P',
      'Financial District, Nanakramguda Rd, Manikonda Jagir',
      'Rangareddy Dist., Hyderabad, Telangana 500032, INDIA',
    ],
    mapUrl: 'https://maps.app.goo.gl/GmkTFXkzesuFMvsM9',
    locationLabel: 'Hyderabad',
  },
];

const emails = [
  { addr: 'support@vellmontservices.com', label: 'general support' },
  { addr: 'finance@vellmontservices.com', label: 'billing & finance' },
];

const phones = [
  { flag: '🇦🇪', number: '+971 547594261', label: 'Dubai, UAE' },
  { flag: '🇮🇳', number: '+91 7702216501', label: 'Hyderabad, India' },
  { flag: '🇺🇸', number: '+1 (813) 203-8044', label: 'USA' },
];

const cardBase =
  'rounded-2xl bg-white border border-[rgba(30,26,61,0.1)] hover:border-[rgba(30,26,61,0.2)] transition-colors shadow-[0_1px_2px_rgba(30,26,61,0.04)]';

const inputBase =
  'w-full bg-[#F5EFE7] border border-[rgba(30,26,61,0.12)] rounded-lg px-3.5 py-2.5 text-[14px] text-[#1E1A3D] placeholder:text-[#8F8AA0] focus:outline-none focus:border-[#5848F8] focus:ring-2 focus:ring-[#5848F8]/15 transition-colors';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'Something is missing',
        description: 'Please fill out every field before sending.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Message sent',
      description: "Thanks for reaching out — we'll reply soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-[#F5EFE7] text-[#1E1A3D] font-sans antialiased">
      <Seo
        title="Contact Vellmont Services — Hyderabad · Dubai · USA"
        description="Reach Vellmont Services for software builds, product partnerships, or support. Offices in Hyderabad (India), Dubai (UAE), and a US line. Email support@vellmontservices.com or call +91 7702216501 / +971 547594261 / +1 (813) 203-8044."
        canonical="https://vellmontservices.com/contact"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />

      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pt-10 md:pt-16 pb-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-6 h-px bg-[#5848F8]" />
          <span className={typography.eyebrow}>Contact</span>
        </div>
        <h1 className={`${typography.sectionHeading} text-[#1E1A3D] max-w-[760px]`}>
          Tell us what you&rsquo;re{' '}
          <span className={typography.italicAccent}>building</span>
          <span className="text-[#1E1A3D]">.</span>
        </h1>
        <p className={`${typography.bodyLg} mt-6 max-w-[620px]`}>
          Send a real brief, a half-formed Notion doc, or a one-line idea. We read
          every message and reply with either a real plan or an honest
          &ldquo;we&rsquo;re not the right team.&rdquo;
        </p>
        <div className="mt-8">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#5848F8] text-white text-[14px] font-medium px-6 py-3.5 hover:bg-[#4736E4] transition-colors shadow-[0_10px_30px_-12px_rgba(88,72,248,0.55)]"
          >
            Book a demo <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8F8AA0] mb-4">
          Our offices
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offices.map((o) => (
            <motion.div
              key={o.company}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
              className={`${cardBase} p-6 md:p-7`}
            >
              <div className="font-mono text-[10px] text-[#8F8AA0] mb-2 uppercase tracking-[0.18em]">
                {o.locationLabel}
              </div>
              <div className="font-display text-[19px] tracking-tight mb-2 text-[#1E1A3D]">
                {o.company}
              </div>
              <div className="text-[13.5px] text-[#4B4762] leading-[1.6] space-y-0.5 mb-4">
                {o.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <a
                href={o.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-[#5848F8] hover:text-[#3B2AD6] transition-colors inline-flex items-center gap-1.5"
              >
                view on map <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8F8AA0] mb-4">
          Reach us
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${cardBase} p-5`}>
            <div className="font-mono text-[10px] text-[#8F8AA0] mb-3 uppercase tracking-[0.18em]">
              Email
            </div>
            <div className="flex flex-col gap-2">
              {emails.map((e) => (
                <div key={e.addr}>
                  <a
                    href={`mailto:${e.addr}`}
                    className="text-[14px] font-medium text-[#1E1A3D] hover:text-[#5848F8] transition-colors block"
                  >
                    {e.addr}
                  </a>
                  <div className="font-mono text-[11px] text-[#8F8AA0]">{e.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-5`}>
            <div className="font-mono text-[10px] text-[#8F8AA0] mb-3 uppercase tracking-[0.18em]">
              Phone
            </div>
            <div className="flex flex-col gap-2">
              {phones.map((p) => (
                <div key={p.number}>
                  <a
                    href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                    className="text-[14px] font-medium text-[#1E1A3D] hover:text-[#5848F8] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[15px] leading-none" aria-hidden="true">{p.flag}</span>
                    <span>{p.number}</span>
                  </a>
                  <div className="font-mono text-[11px] text-[#8F8AA0]">{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-5`}>
            <div className="font-mono text-[10px] text-[#8F8AA0] mb-3 uppercase tracking-[0.18em]">
              Hours
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-[14px] font-medium text-[#1E1A3D]">Mon – Fri</div>
                <div className="font-mono text-[11px] text-[#8F8AA0]">9 AM – 6 PM IST</div>
              </div>
              <div>
                <div className="text-[14px] font-medium text-[#1E1A3D]">Sat – Sun</div>
                <div className="font-mono text-[11px] text-[#8F8AA0]">closed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1220px] px-5 md:px-10 lg:px-14 pb-16">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8F8AA0] mb-4">
          Send a message
        </div>
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className={`${cardBase} p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[820px]`}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F8AA0]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputBase}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F8AA0]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className={inputBase}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="subject" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F8AA0]">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className={inputBase}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F8AA0]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you're trying to build, what you've tried, what's stuck."
              className={`${inputBase} resize-y`}
            />
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
            <p className="text-[12px] text-[#8F8AA0] font-mono">
              we read every message · reply within 1 business day
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[#5848F8] text-white text-[14px] font-medium px-5 py-3 hover:bg-[#4736E4] transition-colors whitespace-nowrap shadow-[0_10px_30px_-12px_rgba(88,72,248,0.55)]"
            >
              Send message <span aria-hidden="true">→</span>
            </button>
          </div>
        </motion.form>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
