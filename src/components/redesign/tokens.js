// Single source of truth for the redesign.
// All product data, color mappings, and typography helpers live here.

// Dark-theme color tokens. Soft tinted backgrounds (10–15% opacity), inset
// rings for definition, and 300-shade text so colors stay legible on the
// near-black page without screaming.
export const colorCategories = {
  healthcare: {
    label: "HEALTHCARE",
    bg: "bg-teal-500/10",
    text: "text-teal-200",
    pillBg: "bg-teal-500/15 ring-1 ring-inset ring-teal-500/30",
    pillText: "text-teal-300",
    accent: "text-teal-400",
  },
  astrology: {
    label: "ASTROLOGY",
    bg: "bg-pink-500/10",
    text: "text-pink-200",
    pillBg: "bg-pink-500/15 ring-1 ring-inset ring-pink-500/30",
    pillText: "text-pink-300",
    accent: "text-pink-400",
  },
  travel: {
    label: "TRAVEL",
    bg: "bg-blue-500/10",
    text: "text-blue-200",
    pillBg: "bg-blue-500/15 ring-1 ring-inset ring-blue-500/30",
    pillText: "text-blue-300",
    accent: "text-blue-400",
  },
  education: {
    label: "EDUCATION",
    bg: "bg-emerald-500/10",
    text: "text-emerald-200",
    pillBg: "bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/30",
    pillText: "text-emerald-300",
    accent: "text-emerald-400",
  },
  social: {
    label: "SOCIAL",
    bg: "bg-purple-500/10",
    text: "text-purple-200",
    pillBg: "bg-purple-500/15 ring-1 ring-inset ring-purple-500/30",
    pillText: "text-purple-300",
    accent: "text-purple-400",
  },
  finance: {
    label: "FINANCE",
    bg: "bg-amber-500/10",
    text: "text-amber-200",
    pillBg: "bg-amber-500/15 ring-1 ring-inset ring-amber-500/30",
    pillText: "text-amber-300",
    accent: "text-amber-400",
  },
};

export const products = [
  {
    id: "medquepms",
    name: "MedQue",
    suffix: "PMS",
    domain: "medquepms.vellmontservices.com",
    logo: "https://medquepms.vellmontservices.com/favicon-32.png",
    category: "healthcare",
    oneLiner: "Run a whole clinic — queue to billing — from one screen.",
    longDescription:
      "Cloud-based clinic OS that unifies a live token queue, doctor consultation workspace, AI Clinical Pre-Read, pharmacy POS, cashless/TPA workflow, billing, and a native patient app. Patients book via WhatsApp, missed-call, IVR, or AI chat; the doctor walks in already knowing them. Built for India — rupee billing, DLT telecom, ABDM-ready, cash-first.",
    tags: [
      "live queue",
      "AI pre-read",
      "WhatsApp booking",
      "pharmacy POS",
      "cashless / TPA",
      "patient app",
    ],
    size: "flagship",
  },
  {
    id: "vedjyotix",
    name: "Vedjyotix",
    domain: "vedjyotix.com",
    logo: "https://vedjyotix.com/favicon.svg",
    category: "astrology",
    oneLiner: "Astrology, numerology, gun-milan + astrologer marketplace.",
    longDescription:
      "Astrology, numerology, gun-milan. Plus a marketplace where verified astrologers take chat and video bookings.",
    tags: ["kundli", "gun-milan", "marketplace", "video calls"],
    size: "medium",
  },
  {
    id: "vellroute",
    name: "Vellroute",
    domain: "vellroute.com",
    logo: "/logos/vellroute.svg",
    logoBleed: true,
    category: "travel",
    oneLiner: "Tour operators stop juggling six WhatsApp groups.",
    longDescription:
      "Operators stop juggling six WhatsApp groups. Hotels, drivers, tourists — all in one screen.",
    tags: ["itinerary", "hotels", "drivers", "tourists"],
    size: "medium",
  },
  {
    id: "tutora",
    name: "Tutora",
    domain: "tutorra.vellmontservices.com",
    category: "education",
    oneLiner: "Tutors book, students pay, classes happen.",
    longDescription:
      "A platform to manage tutoring where tutors and students register, payments happen up front, and classes run inside the app.",
    tags: ["scheduling", "payments", "classes"],
    size: "small",
  },
  {
    id: "invitesync",
    name: "InviteSync",
    domain: "invitesync.com",
    logo: "https://invitesync.com/favicon.svg",
    category: "social",
    oneLiner: "Every invite you ever got, in one place.",
    longDescription:
      "Store every invitation — wedding, birthday, corporate — on web and mobile. Reminders included.",
    tags: ["invites", "reminders", "mobile"],
    size: "small",
  },
  {
    id: "vellbill",
    name: "Vellbill",
    domain: "vellbill.com",
    logo: "https://vellbill.com/vellbill-mark.png",
    category: "finance",
    oneLiner: "Invoices and expenses for businesses still emailing PDFs.",
    longDescription:
      "Create and manage invoices and expenses for a company. Also handles random one-off invoices for freelancers.",
    tags: ["invoicing", "expenses", "GST"],
    size: "small",
  },
];

export const flagshipProduct = products.find((p) => p.size === "flagship");
export const mediumProducts = products.filter((p) => p.size === "medium");
export const smallProducts = products.filter((p) => p.size === "small");

export const typography = {
  displayHeadline:
    "font-sans font-medium tracking-[-0.035em] leading-[1] text-4xl md:text-5xl lg:text-[52px]",
  italicAccent: "font-serif italic font-normal",
  monoLabel:
    "font-mono text-[11px] uppercase tracking-wider text-neutral-500",
  sectionHeading:
    "font-sans font-medium tracking-[-0.02em] text-2xl md:text-[26px]",
};
