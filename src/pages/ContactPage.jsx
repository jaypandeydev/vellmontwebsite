import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Nav from '@/components/redesign/Nav';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';
import { typography } from '@/components/redesign/tokens';

const offices = [
  {
    company: 'VELLMONT IT SERVICES L.L.C',
    lines: [
      'Building Name/No Rigga Business Centre-3001',
      'Land Area — Al Murqabat Plot No 466-0',
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
  { number: '+971 547594261', label: 'Dubai, UAE' },
  { number: '+91 8143210000', label: 'Hyderabad, India' },
];

const cardBase =
  'rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.05] hover:border-white/20';

const inputBase =
  'bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-colors';

function SectionLabel({ left, right }) {
  return (
    <div className="flex justify-between items-baseline mb-5">
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {left}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {right}
      </div>
    </div>
  );
}

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
    <main className="min-h-screen bg-[#050816] text-neutral-100 font-sans antialiased">
      <Seo
        title="Contact Vellmont Services — Hyderabad & Dubai offices"
        description="Reach Vellmont Services for software builds, product partnerships, or support. Offices in Hyderabad (India) and Dubai (UAE). Email support@vellmontservices.com or call +91 8143210000 / +971 547594261."
        canonical="https://vellmontservices.com/contact"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />

      <section className="relative px-5 md:px-10 lg:px-20 pt-10 md:pt-14 pb-8 overflow-hidden">
        {/* Atmospheric brand glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-indigo-600/20 via-violet-600/12 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-emerald-500/12 to-transparent blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            <span>CONTACT</span>
            <span>DUBAI · HYDERABAD</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              REPLIES WITHIN 1 BUSINESS DAY
            </span>
          </div>

          <h1
            className={`${typography.displayHeadline} max-w-[640px] mb-5 text-white`}
          >
            Tell us what you're{' '}
            <span className={`${typography.italicAccent}`}>
              building
            </span>
            .
          </h1>

          <p className="text-[15px] leading-[1.6] text-neutral-400 max-w-[620px]">
            Send a real brief, a half-formed Notion doc, or a one-line idea.
            We read every message and reply with either a real plan or an honest
            "we're not the right team."
          </p>
        </motion.div>
      </section>

      <section className="px-5 md:px-10 lg:px-20 pb-8">
        <SectionLabel left="── OUR OFFICES ────────────" right="01/03 ──" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {offices.map((o) => (
            <motion.div
              key={o.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className={`${cardBase} p-6 md:p-7`}
            >
              <div className="font-mono text-[10px] text-neutral-500 mb-2 uppercase tracking-wider">
                {o.locationLabel}
              </div>
              <div className="font-medium text-[17px] tracking-[-0.01em] mb-2 text-white">
                {o.company}
              </div>
              <div className="text-[13px] text-neutral-400 leading-[1.6] space-y-0.5 mb-4">
                {o.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <a
                href={o.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-indigo-300 underline underline-offset-4 hover:text-indigo-200 transition-colors"
              >
                view on map →
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-20 pb-8">
        <SectionLabel left="── REACH US ───────────────" right="02/03 ──" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
            className={`${cardBase} p-5`}
          >
            <div className="font-mono text-[10px] text-neutral-500 mb-2 uppercase tracking-wider">
              Email
            </div>
            <div className="flex flex-col gap-2">
              {emails.map((e) => (
                <div key={e.addr}>
                  <a
                    href={`mailto:${e.addr}`}
                    className="text-[14px] font-medium text-white hover:text-indigo-300 transition-colors block"
                  >
                    {e.addr}
                  </a>
                  <div className="font-mono text-[11px] text-neutral-500">
                    {e.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={`${cardBase} p-5`}
          >
            <div className="font-mono text-[10px] text-neutral-500 mb-2 uppercase tracking-wider">
              Phone
            </div>
            <div className="flex flex-col gap-2">
              {phones.map((p) => (
                <div key={p.number}>
                  <a
                    href={`tel:${p.number.replace(/\s+/g, '')}`}
                    className="text-[14px] font-medium text-white hover:text-indigo-300 transition-colors block"
                  >
                    {p.number}
                  </a>
                  <div className="font-mono text-[11px] text-neutral-500">
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${cardBase} p-5`}
          >
            <div className="font-mono text-[10px] text-neutral-500 mb-2 uppercase tracking-wider">
              Hours
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-[14px] font-medium text-white">
                  Mon – Fri
                </div>
                <div className="font-mono text-[11px] text-neutral-500">
                  9 AM – 6 PM IST
                </div>
              </div>
              <div>
                <div className="text-[14px] font-medium text-white">
                  Sat – Sun
                </div>
                <div className="font-mono text-[11px] text-neutral-500">
                  closed
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-20 pb-12">
        <SectionLabel left="── SEND A MESSAGE ─────────" right="03/03 ──" />
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className={`${cardBase} p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[820px]`}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
            <label htmlFor="subject" className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
            <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
            <p className="text-[12px] text-neutral-500 font-mono">
              we read every message · reply within 1 business day
            </p>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-5 py-3 rounded-lg text-[13px] font-medium hover:from-indigo-400 hover:to-violet-500 transition-colors whitespace-nowrap shadow-[0_8px_24px_-6px_rgba(99,102,241,0.55)]"
            >
              Send message →
            </button>
          </div>
        </motion.form>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
