import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, CheckCircle2, AlertCircle, Info, Upload } from 'lucide-react';
import {
  BRANDS, DEPARTMENTS, EXPERIENCE_BANDS, NOTICE_PERIODS, ASTRO_SPECIALISATIONS,
  CONSULTATION_LANGUAGES, ASTRO_EXPERIENCE_BANDS, CONSULTATION_AVAILABILITY,
  ASTROLOGER_ROLE, OTHER_ROLE, CV_MAX_BYTES, CV_ALLOWED_EXTENSIONS, CV_POLICY_TEXT,
  TRACKED_QUERY_PARAMS, COUNTRIES, findRole, findDepartment, isValidSlug,
} from '../../../shared/careersCatalog';
import { submitApplication, ApiError } from '@/lib/careersApi';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const labelClass = 'font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F8AA0]';
const inputBase =
  'w-full bg-[#F5EFE7] border border-[rgba(30,26,61,0.12)] rounded-lg px-3.5 py-2.5 text-[15px] md:text-[14px] text-[#1E1A3D] placeholder:text-[#8F8AA0] focus:outline-none focus:border-[#5848F8] focus:ring-2 focus:ring-[#5848F8]/15 transition-colors disabled:opacity-60';
const inputError = 'border-[#B23A3A] focus:border-[#B23A3A] focus:ring-[#B23A3A]/15';
const helpClass = 'text-[12px] text-[#8F8AA0]';
const errClass = 'text-[12.5px] text-[#B23A3A]';
const chipBase =
  'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13.5px] cursor-pointer select-none transition-colors';

const EMPTY = {
  full_name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  department: '',
  role: '',
  role_other: '',
  brand: '',
  experience_band: '',
  skills: '',
  notice_period: '',
  linkedin_url: '',
  portfolio_url: '',
  introduction: '',
  astro_specialisations: [],
  astro_languages: [],
  astro_experience: '',
  astro_availability: '',
  consent: false,
  website: '', // honeypot — humans never see it
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalisePhone(raw) {
  const compact = raw.replace(/[\s\-().]/g, '');
  return compact.startsWith('00') ? `+${compact.slice(2)}` : compact;
}

function validate(values, file) {
  const e = {};
  if (values.full_name.trim().length < 2) e.full_name = 'Please enter your full name.';
  if (!EMAIL_RE.test(values.email.trim())) e.email = 'Please enter a valid email address.';
  if (!/^\+[1-9]\d{6,14}$/.test(normalisePhone(values.phone.trim()))) {
    e.phone = 'Include your country code, e.g. +91 98765 43210.';
  }
  if (!values.city.trim()) e.city = 'Please enter your current city.';
  if (!isValidSlug(COUNTRIES, values.country)) e.country = 'Please select your current country.';
  if (!values.department) e.department = 'Please choose a department.';
  if (!findRole(values.role)) e.role = 'Please choose a role.';
  if (values.role === OTHER_ROLE && values.role_other.trim().length < 2) e.role_other = 'Tell us which role you are looking for.';
  if (!values.brand) e.brand = 'Please choose a brand preference.';
  if (!values.experience_band) e.experience_band = 'Please choose your years of relevant experience.';
  if (values.skills.trim().length < 2) e.skills = 'List a few key skills.';
  if (!values.notice_period) e.notice_period = 'Please choose your notice period or availability.';
  if (values.linkedin_url.trim() && !/linkedin\.com\//i.test(values.linkedin_url)) e.linkedin_url = 'Enter a LinkedIn profile URL, or leave it blank.';
  if (values.portfolio_url.trim() && !/^(https?:\/\/)?[^\s/]+\.[^\s]+$/i.test(values.portfolio_url.trim())) e.portfolio_url = 'Enter a valid URL, or leave it blank.';
  if (values.introduction.length > 1500) e.introduction = 'Please keep this under 1,500 characters.';
  if (values.role === ASTROLOGER_ROLE) {
    if (!values.astro_specialisations.length) e.astro_specialisations = 'Choose at least one specialisation.';
    if (!values.astro_languages.length) e.astro_languages = 'Choose at least one consultation language.';
    if (!values.astro_experience) e.astro_experience = 'Choose your years of astrology experience.';
    if (!values.astro_availability) e.astro_availability = 'Choose your consultation availability.';
  }
  if (!file) e.cv = 'Please attach your CV.';
  else {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!CV_ALLOWED_EXTENSIONS.includes(ext)) e.cv = 'Only PDF, DOC or DOCX files are accepted.';
    else if (file.size > CV_MAX_BYTES) e.cv = 'Your CV is larger than 5 MB. Please upload a smaller file.';
    else if (file.size < 100) e.cv = 'That file looks empty. Please upload your CV.';
  }
  if (!values.consent) e.consent = 'Please confirm you agree to us processing your application.';
  return e;
}

function Field({ id, label, required, error, help, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? <span aria-hidden="true" className="text-[#5848F8]"> *</span> : <span className="normal-case tracking-normal"> · optional</span>}
      </label>
      {children}
      {help && !error ? <p id={`${id}-help`} className={helpClass}>{help}</p> : null}
      {error ? <p id={`${id}-error`} className={errClass} role="alert">{error}</p> : null}
    </div>
  );
}

function aria(id, error, help) {
  const described = [error ? `${id}-error` : null, help && !error ? `${id}-help` : null].filter(Boolean).join(' ');
  return { 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': described || undefined };
}

function Select({ id, name, value, onChange, options, placeholder, error, disabled, help }) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${inputBase} ${error ? inputError : ''}`}
      {...aria(id, error, help)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.slug} value={o.slug}>{o.label}</option>
      ))}
    </select>
  );
}

function CheckGroup({ name, legend, options, value, onToggle, error, help }) {
  const id = `${name}-group`;
  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? `${id}-error` : help ? `${id}-help` : undefined} aria-invalid={error ? 'true' : undefined}>
      <legend className={`${labelClass} mb-1.5`}>{legend}<span aria-hidden="true" className="text-[#5848F8]"> *</span></legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value.includes(o.slug);
          return (
            <label
              key={o.slug}
              className={`${chipBase} ${checked ? 'bg-[#5848F8] border-[#5848F8] text-white' : 'bg-white border-[rgba(30,26,61,0.14)] text-[#1E1A3D] hover:border-[rgba(30,26,61,0.3)]'}`}
            >
              <input
                type="checkbox"
                name={name}
                value={o.slug}
                checked={checked}
                onChange={() => onToggle(o.slug)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {help && !error ? <p id={`${id}-help`} className={helpClass}>{help}</p> : null}
      {error ? <p id={`${id}-error`} className={errClass} role="alert">{error}</p> : null}
    </fieldset>
  );
}

function useTurnstile(enabled, onToken) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled || !ref.current) return undefined;
    let widgetId;
    const render = () => {
      if (!window.turnstile || !ref.current || widgetId !== undefined) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };
    if (window.turnstile) render();
    else {
      const existing = document.querySelector('script[data-turnstile]');
      const script = existing || document.createElement('script');
      if (!existing) {
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.setAttribute('data-turnstile', '1');
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
      return () => script.removeEventListener('load', render);
    }
    return () => {
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [enabled, onToken]);
  return ref;
}

/**
 * @param {object} props
 * @param {{role?: string, brand?: string}} props.preset  — validated query params
 * @param {object} props.attribution — utm_* + landing_role/brand + referrer
 * @param {{slug: string, nonce: number}|null} props.roleRequest — set by role chips on the page
 */
export default function ApplicationForm({ preset = {}, attribution = {}, roleRequest = null }) {
  const [values, setValues] = useState(() => {
    const role = findRole(preset.role);
    return {
      ...EMPTY,
      role: role ? role.slug : '',
      department: role ? role.department : '',
      brand: preset.brand || '',
    };
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error | notice
  const [serverMessage, setServerMessage] = useState('');
  const [reference, setReference] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const idempotencyKey = useRef(uuidv4());
  const startedAt = useRef(Date.now());
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const summaryRef = useRef(null);
  const abortRef = useRef(null);

  const turnstileRef = useTurnstile(Boolean(TURNSTILE_SITE_KEY), setTurnstileToken);

  // Role chips on the page push a role into the form.
  useEffect(() => {
    if (!roleRequest) return;
    const role = findRole(roleRequest.slug);
    if (!role) return;
    setValues((v) => ({ ...v, role: role.slug, department: role.department }));
    setErrors((e) => ({ ...e, role: undefined, department: undefined }));
  }, [roleRequest]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const department = findDepartment(values.department);
  const roleOptions = useMemo(() => (department ? department.roles : []), [department]);
  const isAstrologer = values.role === ASTROLOGER_ROLE;
  const isOther = values.role === OTHER_ROLE;

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };
  const onChange = (e) => set(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value);

  const onDepartment = (e) => {
    const slug = e.target.value;
    setValues((v) => ({ ...v, department: slug, role: '' , role_other: '' }));
    setErrors((er) => ({ ...er, department: undefined, role: undefined }));
  };

  const toggleIn = (name, slug) => {
    setValues((v) => {
      const cur = v[name];
      return { ...v, [name]: cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug] };
    });
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setErrors((er) => ({ ...er, cv: undefined }));
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs).find((k) => errs[k]);
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector(`[name="${first}"]`) || summaryRef.current;
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return; // double-click guard
    const errs = validate(values, file);
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      setStatus('error');
      setServerMessage('Some details need attention. Please check the highlighted fields.');
      focusFirstError(errs);
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus('error');
      setServerMessage('Please complete the verification challenge before submitting.');
      return;
    }

    const fd = new FormData();
    const skipKeys = new Set(['astro_specialisations', 'astro_languages', 'astro_experience', 'astro_availability', 'consent', 'role_other']);
    for (const [k, v] of Object.entries(values)) {
      if (skipKeys.has(k)) continue;
      fd.append(k, typeof v === 'string' ? v.trim() : String(v));
    }
    fd.set('phone', normalisePhone(values.phone.trim()));
    fd.append('consent', values.consent ? 'yes' : 'no');
    if (isOther) fd.append('role_other', values.role_other.trim());
    if (isAstrologer) {
      values.astro_specialisations.forEach((s) => fd.append('astro_specialisations', s));
      values.astro_languages.forEach((s) => fd.append('astro_languages', s));
      fd.append('astro_experience', values.astro_experience);
      fd.append('astro_availability', values.astro_availability);
    }
    fd.append('cv', file, file.name);
    fd.append('idempotency_key', idempotencyKey.current);
    fd.append('form_elapsed_ms', String(Date.now() - startedAt.current));
    if (turnstileToken) fd.append('cf-turnstile-response', turnstileToken);
    for (const key of TRACKED_QUERY_PARAMS) if (attribution[key]) fd.append(key, attribution[key]);
    if (attribution.landing_role) fd.append('landing_role', attribution.landing_role);
    if (attribution.landing_brand) fd.append('landing_brand', attribution.landing_brand);
    if (attribution.referrer) fd.append('referrer', attribution.referrer);

    setStatus('submitting');
    setServerMessage('');
    abortRef.current = new AbortController();
    try {
      const result = await submitApplication(fd, { signal: abortRef.current.signal });
      setReference(result.reference);
      setStatus('success');
      requestAnimationFrame(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      if (err.name === 'AbortError') return;
      setStatus('error');
      if (err instanceof ApiError) {
        // 409: an earlier application already exists for this email + role.
        // Nothing new was stored, so this is a notice, not a confirmation.
        if (err.code === 'duplicate') setStatus('notice');
        setServerMessage(err.message);
        if (err.errors && Object.keys(err.errors).length) {
          setErrors((prev) => ({ ...prev, ...err.errors }));
          focusFirstError(err.errors);
        } else {
          requestAnimationFrame(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        }
      } else {
        setServerMessage('Something went wrong. Your details are still on this page — please try again.');
      }
      if (TURNSTILE_SITE_KEY && window.turnstile) {
        try { window.turnstile.reset(); } catch { /* ignore */ }
        setTurnstileToken('');
      }
    }
  };

  const reset = () => {
    setValues({ ...EMPTY, brand: values.brand });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrors({});
    setStatus('idle');
    setServerMessage('');
    setReference('');
    idempotencyKey.current = uuidv4();
    startedAt.current = Date.now();
  };

  if (status === 'success') {
    return (
      <div ref={summaryRef} className="rounded-2xl bg-white border border-[rgba(30,26,61,0.1)] p-6 md:p-8 max-w-[820px]" role="status" aria-live="polite">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#3B7A4E] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-display text-[26px] md:text-[30px] leading-[1.1] tracking-tight text-[#1E1A3D]">
              Application received.
            </h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-[#4B4762]">
              Your profile and CV have been stored. Your reference is{' '}
              <span className="font-mono text-[#1E1A3D] bg-[#F5EFE7] px-1.5 py-0.5 rounded">{reference}</span>.
              We read every application; if a role matches, we&rsquo;ll get in touch by email or phone.
            </p>
            <p className="mt-2 text-[13px] text-[#8F8AA0]">
              Keep the reference handy if you need to write to us about this application.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(30,26,61,0.14)] bg-white text-[#1E1A3D] text-[14px] font-medium px-5 py-2.5 hover:border-[rgba(30,26,61,0.3)] transition-colors"
            >
              Submit another application
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-busy={submitting}
      className="rounded-2xl bg-white border border-[rgba(30,26,61,0.1)] p-5 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[820px]"
    >
      <div ref={summaryRef} className="md:col-span-2 scroll-mt-24">
        {status === 'error' && serverMessage ? (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-[#F6DADA] text-[#5A1F1F] px-4 py-3 text-[13.5px] leading-[1.5]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{serverMessage}</span>
          </div>
        ) : status === 'notice' && serverMessage ? (
          <div role="status" aria-live="polite" className="flex items-start gap-2.5 rounded-lg bg-[#5848F8]/10 text-[#2E1E5C] px-4 py-3 text-[13.5px] leading-[1.5]">
            <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{serverMessage}</span>
          </div>
        ) : (
          <p className="text-[13px] text-[#8F8AA0]">
            Fields marked <span className="text-[#5848F8]">*</span> are required. No account needed.
          </p>
        )}
      </div>

      <Field id="full_name" label="Full name" required error={errors.full_name}>
        <input id="full_name" name="full_name" type="text" autoComplete="name" value={values.full_name} onChange={onChange} placeholder="Your full name" disabled={submitting} className={`${inputBase} ${errors.full_name ? inputError : ''}`} {...aria('full_name', errors.full_name)} />
      </Field>

      <Field id="email" label="Email address" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={onChange} placeholder="you@example.com" disabled={submitting} className={`${inputBase} ${errors.email ? inputError : ''}`} {...aria('email', errors.email)} />
      </Field>

      <Field id="phone" label="Phone (with country code)" required error={errors.phone} help="Include your country code, e.g. +91 or +971.">
        <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={onChange} placeholder="+91 98765 43210" disabled={submitting} className={`${inputBase} ${errors.phone ? inputError : ''}`} {...aria('phone', errors.phone, 'help')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field id="city" label="Current city" required error={errors.city}>
          <input id="city" name="city" type="text" autoComplete="address-level2" value={values.city} onChange={onChange} placeholder="Hyderabad" disabled={submitting} className={`${inputBase} ${errors.city ? inputError : ''}`} {...aria('city', errors.city)} />
        </Field>
        <Field id="country" label="Current country" required error={errors.country}>
          <Select id="country" name="country" value={values.country} onChange={onChange} options={COUNTRIES} placeholder="Select country" error={errors.country} disabled={submitting} />
        </Field>
      </div>

      <Field id="department" label="Preferred department" required error={errors.department}>
        <Select id="department" name="department" value={values.department} onChange={onDepartment} options={DEPARTMENTS} placeholder="Choose a department" error={errors.department} disabled={submitting} />
      </Field>

      <Field id="role" label="Preferred role" required error={errors.role} help={!department ? 'Choose a department first.' : undefined}>
        <Select id="role" name="role" value={values.role} onChange={onChange} options={roleOptions} placeholder={department ? 'Choose a role' : 'Choose a department first'} error={errors.role} disabled={submitting || !department} help={!department ? 'help' : undefined} />
      </Field>

      {isOther ? (
        <Field id="role_other" label="Which role are you looking for?" required error={errors.role_other} className="md:col-span-2">
          <input id="role_other" name="role_other" type="text" value={values.role_other} onChange={onChange} placeholder="e.g. Technical Writer, Office Administrator" disabled={submitting} className={`${inputBase} ${errors.role_other ? inputError : ''}`} {...aria('role_other', errors.role_other)} />
        </Field>
      ) : null}

      <fieldset className="md:col-span-2 flex flex-col gap-2" aria-invalid={errors.brand ? 'true' : undefined} aria-describedby={errors.brand ? 'brand-error' : undefined}>
        <legend className={`${labelClass} mb-1.5`}>Brand preference<span aria-hidden="true" className="text-[#5848F8]"> *</span></legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BRANDS.map((b) => {
            const checked = values.brand === b.slug;
            return (
              <label
                key={b.slug}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${checked ? 'border-[#5848F8] bg-[#5848F8]/5' : 'border-[rgba(30,26,61,0.12)] bg-[#F5EFE7] hover:border-[rgba(30,26,61,0.3)]'}`}
              >
                <input type="radio" name="brand" value={b.slug} checked={checked} onChange={onChange} disabled={submitting} className="mt-1 accent-[#5848F8]" />
                <span>
                  <span className="block text-[14px] font-medium text-[#1E1A3D]">{b.label}</span>
                  <span className="block text-[12.5px] text-[#8F8AA0] leading-[1.4]">{b.blurb}</span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.brand ? <p id="brand-error" className={errClass} role="alert">{errors.brand}</p> : null}
      </fieldset>

      <Field id="experience_band" label="Years of relevant experience" required error={errors.experience_band}>
        <Select id="experience_band" name="experience_band" value={values.experience_band} onChange={onChange} options={EXPERIENCE_BANDS} placeholder="Choose your experience" error={errors.experience_band} disabled={submitting} />
      </Field>

      <Field id="notice_period" label="Notice period / availability to join" required error={errors.notice_period}>
        <Select id="notice_period" name="notice_period" value={values.notice_period} onChange={onChange} options={NOTICE_PERIODS} placeholder="Choose your availability" error={errors.notice_period} disabled={submitting} />
      </Field>

      <Field id="skills" label="Key skills" required error={errors.skills} className="md:col-span-2" help="A short comma-separated list is perfect.">
        <textarea id="skills" name="skills" rows={2} maxLength={600} value={values.skills} onChange={onChange} placeholder="e.g. React, Node.js, PostgreSQL, Flutter · or · Vedic astrology, Hindi & Telugu consultations" disabled={submitting} className={`${inputBase} resize-y ${errors.skills ? inputError : ''}`} {...aria('skills', errors.skills, 'help')} />
      </Field>

      {isAstrologer ? (
        <div className="md:col-span-2 rounded-xl border border-[#7B3EA2]/25 bg-[#EAD9F3]/40 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5E2E7D]">Astrologer details</div>
            <p className="text-[13px] text-[#4B4762] mt-1">Helps us match you with the right consultations on VedJyotix.</p>
          </div>
          <div className="md:col-span-2">
            <CheckGroup name="astro_specialisations" legend="Astrology specialisations" options={ASTRO_SPECIALISATIONS} value={values.astro_specialisations} onToggle={(s) => toggleIn('astro_specialisations', s)} error={errors.astro_specialisations} />
          </div>
          <div className="md:col-span-2">
            <CheckGroup name="astro_languages" legend="Consultation languages" options={CONSULTATION_LANGUAGES} value={values.astro_languages} onToggle={(s) => toggleIn('astro_languages', s)} error={errors.astro_languages} />
          </div>
          <Field id="astro_experience" label="Years of astrology experience" required error={errors.astro_experience}>
            <Select id="astro_experience" name="astro_experience" value={values.astro_experience} onChange={onChange} options={ASTRO_EXPERIENCE_BANDS} placeholder="Choose" error={errors.astro_experience} disabled={submitting} />
          </Field>
          <Field id="astro_availability" label="Consultation availability" required error={errors.astro_availability}>
            <Select id="astro_availability" name="astro_availability" value={values.astro_availability} onChange={onChange} options={CONSULTATION_AVAILABILITY} placeholder="Choose" error={errors.astro_availability} disabled={submitting} />
          </Field>
        </div>
      ) : null}

      <Field id="cv" label="CV / résumé" required error={errors.cv} className="md:col-span-2" help={CV_POLICY_TEXT}>
        <label
          htmlFor="cv"
          className={`flex items-center gap-3 rounded-lg border border-dashed px-4 py-3.5 cursor-pointer transition-colors ${errors.cv ? 'border-[#B23A3A] bg-[#F6DADA]/40' : 'border-[rgba(30,26,61,0.2)] bg-[#F5EFE7] hover:border-[#5848F8]'}`}
        >
          <Upload className="w-4 h-4 text-[#5848F8] shrink-0" aria-hidden="true" />
          <span className="text-[14px] text-[#1E1A3D] truncate">
            {file ? file.name : 'Choose a file'}
          </span>
          {file ? <span className="ml-auto text-[12px] text-[#8F8AA0] shrink-0">{(file.size / 1024).toFixed(0)} KB</span> : <span className="ml-auto text-[12px] text-[#8F8AA0] shrink-0 hidden sm:inline">{CV_POLICY_TEXT}</span>}
        </label>
        <input ref={fileInputRef} id="cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFile} disabled={submitting} className="sr-only" {...aria('cv', errors.cv, 'help')} />
      </Field>

      <Field id="linkedin_url" label="LinkedIn profile" error={errors.linkedin_url}>
        <input id="linkedin_url" name="linkedin_url" type="url" inputMode="url" autoComplete="url" value={values.linkedin_url} onChange={onChange} placeholder="https://www.linkedin.com/in/…" disabled={submitting} className={`${inputBase} ${errors.linkedin_url ? inputError : ''}`} {...aria('linkedin_url', errors.linkedin_url)} />
      </Field>

      <Field id="portfolio_url" label="Portfolio / GitHub" error={errors.portfolio_url}>
        <input id="portfolio_url" name="portfolio_url" type="url" inputMode="url" value={values.portfolio_url} onChange={onChange} placeholder="https://github.com/… or your website" disabled={submitting} className={`${inputBase} ${errors.portfolio_url ? inputError : ''}`} {...aria('portfolio_url', errors.portfolio_url)} />
      </Field>

      <Field id="introduction" label="Short introduction" error={errors.introduction} className="md:col-span-2" help={`${values.introduction.length}/1500`}>
        <textarea id="introduction" name="introduction" rows={4} maxLength={1500} value={values.introduction} onChange={onChange} placeholder="What you've built or done, what you're looking for next, anything a CV doesn't show." disabled={submitting} className={`${inputBase} resize-y ${errors.introduction ? inputError : ''}`} {...aria('introduction', errors.introduction, 'help')} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1.5">
        <label className={`flex items-start gap-3 cursor-pointer rounded-lg ${errors.consent ? 'outline outline-1 outline-[#B23A3A] p-2 -m-2' : ''}`}>
          <input type="checkbox" name="consent" checked={values.consent} onChange={onChange} disabled={submitting} className="mt-1 accent-[#5848F8] w-4 h-4" aria-invalid={errors.consent ? 'true' : undefined} aria-describedby={errors.consent ? 'consent-error' : undefined} />
          <span className="text-[13.5px] leading-[1.55] text-[#4B4762]">
            I agree that Vellmont Services may process the details and CV I&rsquo;ve provided to consider me for
            current and future roles across its brands, as described in the{' '}
            <Link to="/privacy-policy" className="underline underline-offset-4 text-[#5848F8] hover:text-[#3B2AD6]" target="_blank" rel="noopener noreferrer">privacy policy</Link>.
            I can ask for my application to be deleted at any time.
            <span aria-hidden="true" className="text-[#5848F8]"> *</span>
          </span>
        </label>
        {errors.consent ? <p id="consent-error" className={errClass} role="alert">{errors.consent}</p> : null}
      </div>

      {TURNSTILE_SITE_KEY ? <div ref={turnstileRef} className="md:col-span-2" /> : null}

      <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
        <p className="text-[12px] text-[#8F8AA0] font-mono">
          your CV is private · only the hiring team can see it
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5848F8] text-white text-[14px] font-medium px-6 py-3 hover:bg-[#4736E4] transition-colors whitespace-nowrap shadow-[0_10px_30px_-12px_rgba(88,72,248,0.55)] disabled:opacity-70 disabled:cursor-wait"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Sending your application…
            </>
          ) : (
            <>
              Submit application <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
