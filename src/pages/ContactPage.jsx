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

function SectionLabel({ left, right }) {
  return (
    <div className="flex justify-between items-baseline mb-5">
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
        {left}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
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
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <Seo
        title="Contact Vellmont Services — Hyderabad & Dubai offices"
        description="Reach Vellmont Services for software builds, product partnerships, or support. Offices in Hyderabad (India) and Dubai (UAE). Email support@vellmontservices.com or call +91 8143210000 / +971 547594261."
        canonical="https://vellmontservices.com/contact"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />

      <section className="px-5 md:px-10 lg:px-20 pt-8 md:pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            <span>CONTACT</span>
            <span>DUBAI · HYDERABAD</span>
            <span className="text-emerald-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              REPLIES WITHIN 1 BUSINESS DAY
            </span>
          </div>

          <h1
            className={`${typography.displayHeadline} max-w-[640px] mb-6 text-neutral-900`}
          >
            Tell us what you're <span className={typography.italicAccent}>building</span>.
          </h1>

          <p className="text-[15px] leading-[1.6] text-neutral-600 max-w-[620px]">
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
              className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 md:p-7 hover:border-neutral-300 transition-colors"
            >
              <div className="font-mono text-[10px] text-neutral-400 mb-2 uppercase tracking-wider">
                {o.locationLabel}
              </div>
              <div className="font-medium text-[17px] tracking-[-0.01em] mb-2">
                {o.company}
              </div>
              <div className="text-[13px] text-neutral-600 leading-[1.6] space-y-0.5 mb-4">
                {o.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <a
                href={o.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors"
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
            className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors"
          >
            <div className="font-mono text-[10px] text-neutral-400 mb-2 uppercase tracking-wider">
              Email
            </div>
            <div className="flex flex-col gap-2">
              {emails.map((e) => (
                <div key={e.addr}>
                  <a
                    href={`mailto:${e.addr}`}
                    className="text-[14px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors block"
                  >
                    {e.addr}
                  </a>
                  <div className="font-mono text-[11px] text-neutral-400">
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
            className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors"
          >
            <div className="font-mono text-[10px] text-neutral-400 mb-2 uppercase tracking-wider">
              Phone
            </div>
            <div className="flex flex-col gap-2">
              {phones.map((p) => (
                <div key={p.number}>
                  <a
                    href={`tel:${p.number.replace(/\s+/g, '')}`}
                    className="text-[14px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors block"
                  >
                    {p.number}
                  </a>
                  <div className="font-mono text-[11px] text-neutral-400">
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
            className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors"
          >
            <div className="font-mono text-[10px] text-neutral-400 mb-2 uppercase tracking-wider">
              Hours
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-[14px] font-medium text-neutral-900">
                  Mon – Fri
                </div>
                <div className="font-mono text-[11px] text-neutral-400">
                  9 AM – 6 PM IST
                </div>
              </div>
              <div>
                <div className="text-[14px] font-medium text-neutral-900">
                  Sat – Sun
                </div>
                <div className="font-mono text-[11px] text-neutral-400">
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
          className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[820px]"
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
              className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
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
              className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
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
              className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
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
              className="bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors resize-y"
            />
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
            <p className="text-[12px] text-neutral-500 font-mono">
              we read every message · reply within 1 business day
            </p>
            <button
              type="submit"
              className="bg-neutral-900 text-white px-5 py-3 rounded-lg text-[13px] font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
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
