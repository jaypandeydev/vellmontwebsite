// Shared careers catalogue — imported by the React page (client-side
// preselection + validation) AND by the careers API (server-side
// validation). Keep it dependency-free and side-effect-free.
//
// These are APPLICATION CATEGORIES, not open vacancies. Nothing here
// claims a role is currently open, nor states headcount, salary or
// benefits.

export const BRANDS = [
  { slug: 'vellmont', label: 'Vellmont Services', blurb: 'Custom software, AI builds and the studio behind every product.' },
  { slug: 'vedjyotix', label: 'VedJyotix', blurb: 'Astrology platform with a verified astrologer marketplace.' },
  { slug: 'medquepms', label: 'MedQuePMS', blurb: 'Clinic and hospital operating system for India.' },
  { slug: 'any', label: 'Open to any', blurb: 'Happy to work across any Vellmont brand.' },
];

export const DEPARTMENTS = [
  {
    slug: 'engineering',
    label: 'Engineering',
    roles: [
      { slug: 'software-developer', label: 'Software Developer' },
      { slug: 'frontend-developer', label: 'Frontend Developer' },
      { slug: 'backend-developer', label: 'Backend Developer' },
      { slug: 'full-stack-developer', label: 'Full Stack Developer' },
      { slug: 'mobile-app-developer-flutter', label: 'Mobile App Developer (Flutter)' },
      { slug: 'devops-cloud-engineer', label: 'DevOps / Cloud Engineer' },
      { slug: 'ai-ml-engineer', label: 'AI / ML Engineer' },
    ],
  },
  {
    slug: 'quality-assurance',
    label: 'Quality Assurance',
    roles: [
      { slug: 'software-tester-qa-engineer', label: 'Software Tester / QA Engineer' },
      { slug: 'automation-test-engineer', label: 'Automation Test Engineer' },
    ],
  },
  {
    slug: 'product-design',
    label: 'Product & Design',
    roles: [
      { slug: 'product-manager', label: 'Product Manager' },
      { slug: 'ui-ux-designer', label: 'UI/UX Designer' },
    ],
  },
  {
    slug: 'people-finance',
    label: 'People & Finance',
    roles: [
      { slug: 'hr-recruiter', label: 'HR / Recruiter' },
      { slug: 'accountant', label: 'Accountant' },
    ],
  },
  {
    slug: 'customer-business',
    label: 'Customer & Business',
    roles: [
      { slug: 'customer-support-executive', label: 'Customer Support Executive' },
      { slug: 'sales-business-development', label: 'Sales / Business Development' },
      { slug: 'digital-marketing-executive', label: 'Digital Marketing Executive' },
    ],
  },
  {
    slug: 'astrology',
    label: 'Astrology',
    roles: [
      { slug: 'astrologer', label: 'Astrologer' },
      { slug: 'customer-success-manager', label: 'Customer Success Manager' },
      { slug: 'relationship-manager', label: 'Relationship Manager' },
    ],
  },
  {
    slug: 'general',
    label: 'General',
    roles: [
      { slug: 'internship', label: 'Internship' },
      { slug: 'other', label: 'Other / General Application' },
    ],
  },
];

// Role that reveals the astrology-specific fields. Customer Success Manager
// and Relationship Manager sit in the Astrology department but do NOT get
// these fields.
export const ASTROLOGER_ROLE = 'astrologer';
// Role that reveals the free-text "desired role" field.
export const OTHER_ROLE = 'other';

export const EXPERIENCE_BANDS = [
  { slug: 'fresher', label: 'Fresher (no work experience yet)' },
  { slug: 'lt1', label: 'Less than 1 year' },
  { slug: '1-3', label: '1 – 3 years' },
  { slug: '3-5', label: '3 – 5 years' },
  { slug: '5-8', label: '5 – 8 years' },
  { slug: '8plus', label: '8+ years' },
];

export const NOTICE_PERIODS = [
  { slug: 'immediate', label: 'Immediately available' },
  { slug: 'upto-15', label: 'Up to 15 days' },
  { slug: '30', label: '30 days' },
  { slug: '60', label: '60 days' },
  { slug: '90', label: '90 days or more' },
  { slug: 'serving', label: 'Currently serving notice' },
];

export const ASTRO_SPECIALISATIONS = [
  { slug: 'vedic', label: 'Vedic / Parashari' },
  { slug: 'kp', label: 'KP system' },
  { slug: 'nadi', label: 'Nadi' },
  { slug: 'lal-kitab', label: 'Lal Kitab' },
  { slug: 'prashna', label: 'Prashna / Horary' },
  { slug: 'numerology', label: 'Numerology' },
  { slug: 'tarot', label: 'Tarot' },
  { slug: 'vastu', label: 'Vastu' },
  { slug: 'palmistry', label: 'Palmistry' },
  { slug: 'matchmaking', label: 'Kundli matching / Gun milan' },
  { slug: 'other', label: 'Other' },
];

export const CONSULTATION_LANGUAGES = [
  { slug: 'hindi', label: 'Hindi' },
  { slug: 'english', label: 'English' },
  { slug: 'telugu', label: 'Telugu' },
  { slug: 'tamil', label: 'Tamil' },
  { slug: 'kannada', label: 'Kannada' },
  { slug: 'malayalam', label: 'Malayalam' },
  { slug: 'marathi', label: 'Marathi' },
  { slug: 'gujarati', label: 'Gujarati' },
  { slug: 'bengali', label: 'Bengali' },
  { slug: 'punjabi', label: 'Punjabi' },
  { slug: 'odia', label: 'Odia' },
  { slug: 'other', label: 'Other' },
];

export const ASTRO_EXPERIENCE_BANDS = [
  { slug: 'lt1', label: 'Less than 1 year' },
  { slug: '1-3', label: '1 – 3 years' },
  { slug: '3-5', label: '3 – 5 years' },
  { slug: '5-10', label: '5 – 10 years' },
  { slug: '10plus', label: '10+ years' },
];

export const CONSULTATION_AVAILABILITY = [
  { slug: 'full-time', label: 'Full-time' },
  { slug: 'part-time', label: 'Part-time (fixed hours)' },
  { slug: 'evenings-weekends', label: 'Evenings and weekends' },
  { slug: 'flexible', label: 'Flexible / on demand' },
];

export const APPLICATION_STATUSES = [
  { slug: 'new', label: 'New' },
  { slug: 'shortlisted', label: 'Shortlisted' },
  { slug: 'interview', label: 'Interview' },
  { slug: 'hired', label: 'Hired' },
  { slug: 'rejected', label: 'Rejected' },
];

// CV upload policy — enforced client-side for UX and server-side for real.
export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const CV_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
export const CV_ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const CV_POLICY_TEXT = 'PDF, DOC or DOCX · up to 5 MB';

// Recruitment-link query parameters we accept. Applicant details never go in
// URLs; only these campaign/category keys are read.
export const TRACKED_QUERY_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];

// ── helpers ────────────────────────────────────────────────────────────────
export const ALL_ROLES = DEPARTMENTS.flatMap((d) =>
  d.roles.map((r) => ({ ...r, department: d.slug, departmentLabel: d.label }))
);

export function findRole(slug) {
  if (!slug) return null;
  return ALL_ROLES.find((r) => r.slug === slug) || null;
}

export function findBrand(slug) {
  if (!slug) return null;
  return BRANDS.find((b) => b.slug === slug) || null;
}

export function findDepartment(slug) {
  if (!slug) return null;
  return DEPARTMENTS.find((d) => d.slug === slug) || null;
}

export function isValidSlug(list, slug) {
  return list.some((item) => item.slug === slug);
}

export function labelFor(list, slug) {
  const hit = list.find((item) => item.slug === slug);
  return hit ? hit.label : slug;
}
