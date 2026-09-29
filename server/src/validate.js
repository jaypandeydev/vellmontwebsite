import {
  BRANDS, EXPERIENCE_BANDS, NOTICE_PERIODS, ASTRO_SPECIALISATIONS,
  CONSULTATION_LANGUAGES, ASTRO_EXPERIENCE_BANDS, CONSULTATION_AVAILABILITY,
  ASTROLOGER_ROLE, OTHER_ROLE, TRACKED_QUERY_PARAMS,
  findRole, findBrand, isValidSlug,
} from '../../shared/careersCatalog.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function str(v) {
  if (Array.isArray(v)) v = v[0];
  if (v === undefined || v === null) return '';
  return String(v).replace(/\u0000/g, '').trim();
}

function list(v) {
  if (v === undefined || v === null) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.flatMap((x) => String(x).split(',')).map((x) => x.trim()).filter(Boolean);
}

function clip(s, n) {
  return s.length > n ? s.slice(0, n) : s;
}

export function normalisePhone(raw) {
  const compact = raw.replace(/[\s\-().]/g, '');
  const withPlus = compact.startsWith('00') ? '+' + compact.slice(2) : compact;
  return withPlus;
}

function checkUrl(raw, { hostSuffix } = {}) {
  if (!raw) return { ok: true, value: null };
  if (raw.length > 300) return { ok: false };
  let u;
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false };
  }
  if (!['http:', 'https:'].includes(u.protocol)) return { ok: false };
  if (hostSuffix && !u.hostname.toLowerCase().endsWith(hostSuffix)) return { ok: false };
  return { ok: true, value: u.toString() };
}

/**
 * Validate a multipart body (already parsed to strings / string arrays).
 * Returns { ok: true, data } or { ok: false, errors: { field: message } }.
 * `data` contains only whitelisted, normalised values.
 */
export function validateApplication(body) {
  const errors = {};
  const d = {};

  d.full_name = clip(str(body.full_name), 120);
  if (d.full_name.length < 2) errors.full_name = 'Please enter your full name.';

  d.email = clip(str(body.email), 254).toLowerCase();
  if (!EMAIL_RE.test(d.email)) errors.email = 'Please enter a valid email address.';

  d.phone = normalisePhone(clip(str(body.phone), 30));
  if (!/^\+[1-9]\d{6,14}$/.test(d.phone)) {
    errors.phone = 'Enter your phone number with country code, e.g. +91 98765 43210.';
  }

  d.city = clip(str(body.city), 100);
  if (!d.city) errors.city = 'Please enter your current city.';
  d.country = clip(str(body.country), 100);
  if (!d.country) errors.country = 'Please enter your current country.';

  const role = findRole(str(body.role));
  if (!role) errors.role = 'Please choose a role.';
  else {
    d.role = role.slug;
    d.department = role.department;
    const dept = str(body.department);
    if (dept && dept !== role.department) errors.department = 'Department does not match the chosen role.';
  }

  d.role_other = null;
  if (role && role.slug === OTHER_ROLE) {
    d.role_other = clip(str(body.role_other), 120);
    if (d.role_other.length < 2) errors.role_other = 'Tell us which role you are looking for.';
  }

  const brand = findBrand(str(body.brand));
  if (!brand) errors.brand = 'Please choose a brand preference.';
  else d.brand = brand.slug;

  d.experience_band = str(body.experience_band);
  if (!isValidSlug(EXPERIENCE_BANDS, d.experience_band)) errors.experience_band = 'Please choose your years of relevant experience.';

  d.skills = clip(str(body.skills), 600);
  if (d.skills.length < 2) errors.skills = 'List a few key skills.';

  d.notice_period = str(body.notice_period);
  if (!isValidSlug(NOTICE_PERIODS, d.notice_period)) errors.notice_period = 'Please choose your notice period or availability.';

  const li = checkUrl(clip(str(body.linkedin_url), 300), { hostSuffix: 'linkedin.com' });
  if (!li.ok) errors.linkedin_url = 'Enter a valid LinkedIn profile URL, or leave it blank.';
  else d.linkedin_url = li.value;

  const pf = checkUrl(clip(str(body.portfolio_url), 300));
  if (!pf.ok) errors.portfolio_url = 'Enter a valid URL, or leave it blank.';
  else d.portfolio_url = pf.value;

  d.introduction = clip(str(body.introduction), 1500) || null;

  // Astrologer-only fields. Silently dropped for every other role.
  d.astro_specialisations = null;
  d.astro_languages = null;
  d.astro_experience = null;
  d.astro_availability = null;
  if (role && role.slug === ASTROLOGER_ROLE) {
    const specs = [...new Set(list(body.astro_specialisations))];
    if (!specs.length || !specs.every((s) => isValidSlug(ASTRO_SPECIALISATIONS, s))) {
      errors.astro_specialisations = 'Choose at least one astrology specialisation.';
    } else d.astro_specialisations = specs;

    const langs = [...new Set(list(body.astro_languages))];
    if (!langs.length || !langs.every((s) => isValidSlug(CONSULTATION_LANGUAGES, s))) {
      errors.astro_languages = 'Choose at least one consultation language.';
    } else d.astro_languages = langs;

    d.astro_experience = str(body.astro_experience);
    if (!isValidSlug(ASTRO_EXPERIENCE_BANDS, d.astro_experience)) errors.astro_experience = 'Choose your years of astrology experience.';

    d.astro_availability = str(body.astro_availability);
    if (!isValidSlug(CONSULTATION_AVAILABILITY, d.astro_availability)) errors.astro_availability = 'Choose your consultation availability.';
  }

  if (str(body.consent) !== 'yes') errors.consent = 'Please confirm you agree to us processing your application.';

  const idem = str(body.idempotency_key);
  if (!UUID_RE.test(idem)) errors.idempotency_key = 'Please reload the page and try again.';
  else d.idempotency_key = idem.toLowerCase();

  // Attribution: only whitelisted keys, each clipped. No applicant data here.
  const source = {};
  for (const key of TRACKED_QUERY_PARAMS) {
    const v = clip(str(body[key]), 200);
    if (v) source[key] = v;
  }
  const landingRole = findRole(str(body.landing_role));
  if (landingRole) source.landing_role = landingRole.slug;
  const landingBrand = findBrand(str(body.landing_brand));
  if (landingBrand) source.landing_brand = landingBrand.slug;
  const ref = clip(str(body.referrer), 500);
  if (ref) {
    try {
      const u = new URL(ref);
      source.referrer = `${u.origin}${u.pathname}`; // drop query string
    } catch { /* ignore junk */ }
  }
  d.source = source;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: d };
}
