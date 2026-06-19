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
    status: "Production Ready",
    screenshots: {
      desktops: [
        "/screenshots/medquepms/desktop-overview.png",
        "/screenshots/medquepms/desktop-patients.png",
        "/screenshots/medquepms/desktop-ai-assist.png",
      ],
      mobiles: [
        "/screenshots/medquepms/mobile-staff-signin.png",
        "/screenshots/medquepms/mobile-patient-app.png",
        "/screenshots/medquepms/mobile-queue-email.png",
      ],
    },
    oneLiner: "AI Clinic Operating System — queue to billing on one screen.",
    longDescription:
      "Cloud-based clinic OS unifying live token queue, doctor consultation workspace, AI Clinical Pre-Read, pharmacy POS, cashless/TPA workflow, billing, and a native patient app. Patients book via WhatsApp, missed-call, IVR, or AI chat; the doctor walks in already knowing them.",
    tags: [
      "Live Queue",
      "WhatsApp Booking",
      "AI Pre-Read",
      "Pharmacy",
      "Cashless / TPA",
      "Patient App",
    ],
    features: [
      "Queue Management",
      "Appointment Booking",
      "WhatsApp Booking",
      "IVR Booking",
      "Patient Mobile App",
      "Nurse Mobile App",
      "Doctor Workspace",
      "Clinical Pre-Read",
      "AI Notes",
      "Billing",
      "Pharmacy Management",
      "Lab Integration",
      "Telemedicine",
      "Prescription Management",
      "Patient History Timeline",
      "Analytics Dashboard",
      "Role Based Access",
      "DLT SMS Integration",
      "Payment Gateway Integration",
    ],
    size: "flagship",
  },
  {
    id: "vellroute",
    name: "Vellroute",
    domain: "vellroute.com",
    logo: "/logos/vellroute.svg",
    logoBleed: true,
    category: "travel",
    status: "Live",
    oneLiner: "Tour Operator Operating System — leads, vendors, bookings, payments.",
    longDescription:
      "End-to-end operator OS that replaces the six WhatsApp groups and spreadsheets a tour business runs on. Leads, packages, bookings, vendors, payments, and a customer portal — coordinated in one screen.",
    tags: [
      "Tour Booking",
      "CRM",
      "Vendor Management",
      "Payments",
      "Customer Portal",
      "WhatsApp",
    ],
    features: [
      "Tour Booking",
      "CRM",
      "Leads",
      "Vendor Management",
      "Payments",
      "Invoices",
      "WhatsApp Integration",
      "Calendar",
      "Reporting",
      "Customer Portal",
      "Agent Management",
      "Tour Packages",
      "Booking Workflow",
    ],
    size: "medium",
  },
  {
    id: "vedjyotix",
    name: "Vedjyotix",
    domain: "vedjyotix.com",
    logo: "https://vedjyotix.com/favicon.svg",
    category: "astrology",
    status: "Live",
    oneLiner: "AI Astrology Platform with a verified astrologer marketplace.",
    longDescription:
      "Kundli, numerology, gun milan, love calculator and AI-generated reports — plus a marketplace where verified astrologers take chat and video consultations. Multilingual.",
    tags: ["Kundli", "Gun Milan", "Marketplace", "AI Reports", "Multilingual"],
    features: [
      "Kundli",
      "Numerology",
      "Love Calculator",
      "Gun Milan",
      "Rahu Kaal",
      "Astrologer Marketplace",
      "Online Consultation",
      "AI Astrology Reports",
      "Multilingual Support",
    ],
    size: "medium",
  },
  {
    id: "tutoro",
    name: "Tutoro",
    domain: "tutorra.vellmontservices.com",
    category: "education",
    status: "Beta",
    oneLiner: "Tutor Marketplace — teachers, students, video sessions, payments.",
    longDescription:
      "A global tutor marketplace. Teachers list profiles and availability, students book, video sessions run inside the app, and payments settle through global rails. Ratings and scheduling baked in.",
    tags: [
      "Teacher Profiles",
      "Booking",
      "Video Sessions",
      "Global Payments",
      "Ratings",
    ],
    features: [
      "Teacher Profiles",
      "Booking System",
      "Video Sessions",
      "Student Dashboard",
      "Teacher Dashboard",
      "Global Payments",
      "Ratings",
      "Scheduling",
    ],
    size: "small",
  },
  {
    id: "invitesync",
    name: "InviteSync",
    domain: "invitesync.com",
    logo: "https://invitesync.com/favicon.svg",
    category: "social",
    status: "Live",
    oneLiner: "Invitation Management — every invite tracked, never missed.",
    longDescription:
      "Track every invitation — wedding, birthday, corporate — across web and mobile. Smart reminders, RSVP tracking, calendar sync, push notifications, and family sharing.",
    tags: [
      "Tracking",
      "Smart Reminders",
      "RSVP",
      "Calendar Sync",
      "Family Sharing",
    ],
    features: [
      "Invitation Tracking",
      "Smart Reminders",
      "Event Management",
      "RSVP Tracking",
      "Family Sharing",
      "Calendar Sync",
      "Push Notifications",
      "Event Templates",
      "Digital Invitations",
    ],
    size: "small",
  },
  {
    id: "vellbill",
    name: "Vellbill",
    domain: "vellbill.com",
    logo: "https://vellbill.com/vellbill-mark.png",
    category: "finance",
    status: "Live",
    oneLiner: "Smart Invoicing — GST, quotations, expenses, recurring billing.",
    longDescription:
      "GST-compliant invoicing and expense management for Indian SMBs and freelancers. Quotations, recurring billing, customer management, payment tracking, and tax-ready reports.",
    tags: [
      "GST Invoices",
      "Quotations",
      "Recurring Billing",
      "Expense Tracking",
      "Tax Reports",
    ],
    features: [
      "GST Invoices",
      "Quotations",
      "Expense Tracking",
      "Customer Management",
      "Payment Tracking",
      "Recurring Billing",
      "Reports",
      "Tax Reports",
      "Dashboard",
    ],
    size: "small",
  },
];

export const flagshipProduct = products.find((p) => p.size === "flagship");
export const mediumProducts = products.filter((p) => p.size === "medium");
export const smallProducts = products.filter((p) => p.size === "small");

// Premium SaaS type scale — Geist for display, Inter for body.
export const typography = {
  displayHeadline:
    "font-display font-medium tracking-[-0.04em] leading-[1.05] text-5xl md:text-6xl lg:text-[72px]",
  // Used for emphasised words inline in headings — gradient text in the brand
  // primary→secondary range, no longer a serif italic.
  italicAccent:
    "bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent",
  monoLabel:
    "font-mono text-[11px] uppercase tracking-wider text-slate-400",
  sectionHeading:
    "font-display font-medium tracking-[-0.025em] text-3xl md:text-4xl lg:text-[40px]",
  bodyLg:
    "text-[17px] md:text-[18px] leading-[1.6] text-slate-300",
};
