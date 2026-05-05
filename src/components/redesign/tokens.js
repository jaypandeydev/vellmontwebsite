// Single source of truth for the redesign.
// All product data, color mappings, and typography helpers live here.

export const colorCategories = {
  healthcare: {
    label: "HEALTHCARE",
    bg: "bg-teal-50",
    text: "text-teal-900",
    pillBg: "bg-teal-100",
    pillText: "text-teal-900",
    accent: "text-teal-600",
  },
  astrology: {
    label: "ASTROLOGY",
    bg: "bg-pink-50",
    text: "text-pink-900",
    pillBg: "bg-pink-100",
    pillText: "text-pink-900",
    accent: "text-pink-600",
  },
  travel: {
    label: "TRAVEL",
    bg: "bg-blue-50",
    text: "text-blue-900",
    pillBg: "bg-blue-100",
    pillText: "text-blue-900",
    accent: "text-blue-600",
  },
  education: {
    label: "EDUCATION",
    bg: "bg-green-50",
    text: "text-green-900",
    pillBg: "bg-green-100",
    pillText: "text-green-900",
    accent: "text-green-600",
  },
  social: {
    label: "SOCIAL",
    bg: "bg-purple-50",
    text: "text-purple-900",
    pillBg: "bg-purple-100",
    pillText: "text-purple-900",
    accent: "text-purple-600",
  },
  finance: {
    label: "FINANCE",
    bg: "bg-amber-50",
    text: "text-amber-900",
    pillBg: "bg-amber-100",
    pillText: "text-amber-900",
    accent: "text-amber-600",
  },
};

export const products = [
  {
    id: "medquepms",
    name: "MedQue",
    suffix: "PMS",
    domain: "medquepms.com",
    category: "healthcare",
    oneLiner: "Clinic OS: queue, consultation, pharmacy CRM, MR schedule.",
    longDescription:
      "One backend for an entire clinic: queue management, doctor consultation, patient records, pharmacy CRM, and MR scheduling. Patients book via WhatsApp, call, or IVR. Doctors stop losing follow-ups.",
    tags: ["queue", "consultation", "pharmacy CRM", "IVR"],
    size: "flagship",
  },
  {
    id: "vedjyotix",
    name: "Vedjyotix",
    domain: "vedjyotix.com",
    category: "astrology",
    oneLiner: "Astrology, numerology, gun-milan + astrologer marketplace.",
    longDescription:
      "Astrology, numerology, gun-milan. Plus a marketplace where verified astrologers take chat and video bookings.",
    tags: ["kundli", "gun-milan", "marketplace", "video calls"],
    size: "medium",
  },
  {
    id: "tourconnect",
    name: "TourConnect",
    domain: "tourconnect.vellmontservices.com",
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
    domain: "vellmontservices.org",
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
    category: "social",
    oneLiner: "Every invite you ever got, in one place.",
    longDescription:
      "Store every invitation — wedding, birthday, corporate — on web and mobile. Reminders included.",
    tags: ["invites", "reminders", "mobile"],
    size: "small",
  },
  {
    id: "invoicer",
    name: "Invoicer",
    domain: "invoicer.vellmontservices.com",
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
