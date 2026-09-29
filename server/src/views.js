// Server-rendered review dashboard. Plain HTML + inline CSS in the site's cream
// editorial palette. Every dynamic value passes through esc().
import {
  APPLICATION_STATUSES, BRANDS, ALL_ROLES, DEPARTMENTS, EXPERIENCE_BANDS, NOTICE_PERIODS,
  ASTRO_SPECIALISATIONS, CONSULTATION_LANGUAGES, ASTRO_EXPERIENCE_BANDS, CONSULTATION_AVAILABILITY, COUNTRIES,
  labelFor,
} from '../../shared/careersCatalog.js';

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const CSS = `
  :root{--bg:#F5EFE7;--ink:#1E1A3D;--muted:#4B4762;--dim:#8F8AA0;--line:rgba(30,26,61,.12);--brand:#5848F8;--brandDeep:#3B2AD6;--white:#fff;--green:#3B7A4E;--red:#B23A3A;--amber:#B25A18}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.55 Inter,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
  a{color:var(--brand);text-decoration:none}a:hover{color:var(--brandDeep)}
  header{position:sticky;top:0;background:rgba(245,239,231,.9);backdrop-filter:blur(8px);border-bottom:1px solid rgba(30,26,61,.06);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
  header .brand{font-family:Georgia,serif;font-size:17px;font-weight:600}
  header .brand span{color:var(--brand)}
  main{max-width:1180px;margin:0 auto;padding:24px 20px 60px}
  h1{font-family:Georgia,serif;font-weight:400;font-size:32px;letter-spacing:-.02em;margin:0 0 6px}
  h2{font-family:Georgia,serif;font-weight:400;font-size:20px;margin:0 0 10px}
  .eyebrow{font-family:ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim)}
  .card{background:var(--white);border:1px solid var(--line);border-radius:16px;padding:18px 20px;box-shadow:0 1px 2px rgba(30,26,61,.04)}
  .grid{display:grid;gap:14px}
  @media(min-width:860px){.grid.two{grid-template-columns:1.4fr 1fr}}
  table{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--line);border-radius:14px;overflow:hidden}
  th,td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(30,26,61,.06);vertical-align:top;font-size:13px}
  th{font-family:ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);font-weight:500;background:#FBF8F3}
  tr:last-child td{border-bottom:0}
  .pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-family:ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--line)}
  .pill.new{background:#E3D9F5;color:#2E1E5C;border-color:transparent}
  .pill.shortlisted{background:#DDE2F0;color:#181E3C;border-color:transparent}
  .pill.interview{background:#F3DEC5;color:#4A2A0E;border-color:transparent}
  .pill.hired{background:#D7EBD9;color:#1F3B26;border-color:transparent}
  .pill.rejected{background:#EFDBE3;color:#4A1E33;border-color:transparent}
  label{display:block;font-family:ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin:0 0 5px}
  input,select,textarea{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:9px 12px;font:inherit;color:var(--ink)}
  input:focus,select:focus,textarea:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(88,72,248,.15)}
  .btn{display:inline-flex;align-items:center;gap:6px;border:0;border-radius:999px;background:var(--brand);color:#fff;font:inherit;font-weight:500;padding:9px 16px;cursor:pointer}
  .btn:hover{background:#4736E4}.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
  .btn.dark{background:var(--ink)}.btn.dark:hover{background:#2A2452}
  .row{display:flex;flex-wrap:wrap;gap:10px;align-items:end}
  .row>*{flex:1 1 150px}
  .kv{display:grid;grid-template-columns:150px 1fr;gap:6px 12px;font-size:13.5px}
  .kv dt{color:var(--dim);font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding-top:2px}
  .kv dd{margin:0;word-break:break-word}
  .muted{color:var(--muted)}.dim{color:var(--dim)}.small{font-size:12px}
  .alert{border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:13px}
  .alert.err{background:#F6DADA;color:#5A1F1F}.alert.ok{background:#D8E8DA;color:#1F3B26}
  .login{max-width:400px;margin:60px auto}
  .timeline li{margin:0 0 6px}
  .pager{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:12px}
  pre{white-space:pre-wrap;font:13px/1.5 Inter,system-ui,sans-serif;margin:0}
`;

export function layout({ title, body, user }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)} · Careers review</title><style>${CSS}</style></head>
<body><header><a class="brand" href="/careers/review">Vellmont<span>.</span> <span class="dim small" style="font-family:Inter,system-ui;font-weight:400">careers review</span></a>
${user ? `<form method="post" action="/careers/review/logout" style="margin:0"><span class="dim small" style="margin-right:10px">${esc(user)}</span><button class="btn ghost" type="submit">Sign out</button></form>` : ''}
</header><main>${body}</main></body></html>`;
}

export function loginPage({ error, next }) {
  return layout({
    title: 'Sign in',
    body: `<div class="login card">
      <div class="eyebrow" style="margin-bottom:8px">Private · reviewers only</div>
      <h1 style="font-size:26px">Careers review</h1>
      <p class="muted small" style="margin:0 0 16px">Applications and CVs are only visible after sign-in.</p>
      ${error ? `<div class="alert err">${esc(error)}</div>` : ''}
      <form method="post" action="/careers/review/login">
        <input type="hidden" name="next" value="${esc(next || '')}">
        <label for="u">Username</label><input id="u" name="username" autocomplete="username" required style="margin-bottom:12px">
        <label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password" required style="margin-bottom:16px">
        <button class="btn dark" type="submit">Sign in →</button>
      </form></div>`,
  });
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

function roleLabel(app) {
  if (app.role === 'other' && app.role_other) return `Other: ${app.role_other}`;
  return labelFor(ALL_ROLES, app.role);
}

export function listPage({ user, apps, filters, total, page, pageSize, counts }) {
  const opt = (list, cur, allLabel) => `<option value="">${esc(allLabel)}</option>` +
    list.map((x) => `<option value="${esc(x.slug)}"${x.slug === cur ? ' selected' : ''}>${esc(x.label)}</option>`).join('');
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const qs = (p) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v) u.set(k, v);
    u.set('page', String(p));
    return `/careers/review?${u.toString()}`;
  };
  const statusChips = APPLICATION_STATUSES.map((s) => `<span class="pill ${esc(s.slug)}">${esc(s.label)} ${counts[s.slug] || 0}</span>`).join(' ');
  const rows = apps.length ? apps.map((a) => `<tr>
      <td class="dim small" style="white-space:nowrap">${esc(fmtDate(a.created_at))}</td>
      <td><a href="/careers/review/applications/${esc(a.id)}"><strong>${esc(a.full_name)}</strong></a><br><span class="dim small">${esc(a.city)}, ${esc(labelFor(COUNTRIES, a.country))}</span></td>
      <td>${esc(roleLabel(a))}<br><span class="dim small">${esc(labelFor(DEPARTMENTS, a.department))}</span></td>
      <td>${esc(labelFor(BRANDS, a.brand))}</td>
      <td>${esc(labelFor(EXPERIENCE_BANDS, a.experience_band))}<br><span class="dim small">${esc(labelFor(NOTICE_PERIODS, a.notice_period))}</span></td>
      <td><span class="pill ${esc(a.status)}">${esc(labelFor(APPLICATION_STATUSES, a.status))}</span></td>
      <td class="small">${a.source && a.source.utm_source ? esc(a.source.utm_source) + (a.source.utm_campaign ? ' · ' + esc(a.source.utm_campaign) : '') : '<span class="dim">direct</span>'}</td>
      <td><a href="/careers/review/applications/${esc(a.id)}/cv">CV ↓</a></td>
    </tr>`).join('') : `<tr><td colspan="8" class="dim" style="padding:28px;text-align:center">No applications match these filters.</td></tr>`;

  return layout({
    title: 'Applications',
    user,
    body: `<div class="eyebrow" style="margin-bottom:6px">Applications</div>
    <h1>Candidate pipeline</h1>
    <div style="margin:8px 0 18px;display:flex;flex-wrap:wrap;gap:6px">${statusChips}</div>
    <form method="get" action="/careers/review" class="card" style="margin-bottom:14px">
      <div class="row">
        <div><label for="q">Search</label><input id="q" name="q" value="${esc(filters.q || '')}" placeholder="name or email"></div>
        <div><label for="status">Status</label><select id="status" name="status">${opt(APPLICATION_STATUSES, filters.status, 'All statuses')}</select></div>
        <div><label for="role">Role</label><select id="role" name="role">${opt(ALL_ROLES, filters.role, 'All roles')}</select></div>
        <div><label for="brand">Brand</label><select id="brand" name="brand">${opt(BRANDS, filters.brand, 'All brands')}</select></div>
        <div style="flex:0 0 auto"><button class="btn" type="submit">Filter</button> <a class="btn ghost" href="/careers/review">Reset</a></div>
        <div style="flex:0 0 auto"><a class="btn ghost" href="/careers/review/export.csv?${esc(new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString())}">Export CSV</a></div>
      </div>
    </form>
    <div style="overflow-x:auto"><table><thead><tr><th>Received</th><th>Candidate</th><th>Role</th><th>Brand</th><th>Experience</th><th>Status</th><th>Source</th><th>CV</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="pager"><span class="dim small">${total} application${total === 1 ? '' : 's'} · page ${page} of ${pages}</span>
      <span>${page > 1 ? `<a class="btn ghost" href="${esc(qs(page - 1))}">← Newer</a>` : ''} ${page < pages ? `<a class="btn ghost" href="${esc(qs(page + 1))}">Older →</a>` : ''}</span></div>`,
  });
}

export function detailPage({ user, app, events, flash, mailEnabled = false }) {
  const dt = (k, v) => v ? `<dt>${esc(k)}</dt><dd>${v}</dd>` : '';
  const link = (u) => u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a>` : '';
  const src = app.source || {};
  const srcRows = Object.entries(src).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  const astro = app.role === 'astrologer' ? `
    <div class="card" style="margin-top:14px"><h2>Astrology profile</h2><dl class="kv">
      ${dt('Specialisations', esc((app.astro_specialisations || []).map((s) => labelFor(ASTRO_SPECIALISATIONS, s)).join(', ')))}
      ${dt('Languages', esc((app.astro_languages || []).map((s) => labelFor(CONSULTATION_LANGUAGES, s)).join(', ')))}
      ${dt('Astrology experience', esc(labelFor(ASTRO_EXPERIENCE_BANDS, app.astro_experience)))}
      ${dt('Availability', esc(labelFor(CONSULTATION_AVAILABILITY, app.astro_availability)))}
    </dl></div>` : '';
  const statusOpts = APPLICATION_STATUSES.map((s) => `<option value="${esc(s.slug)}"${s.slug === app.status ? ' selected' : ''}>${esc(s.label)}</option>`).join('');
  const timeline = events.map((e) => `<li class="small"><span class="dim">${esc(fmtDate(e.at))}</span> · ${e.from_status ? esc(labelFor(APPLICATION_STATUSES, e.from_status)) + ' → ' : ''}<strong>${esc(labelFor(APPLICATION_STATUSES, e.to_status))}</strong> <span class="dim">by ${esc(e.actor)}</span>${e.note ? `<br><span class="muted">${esc(e.note)}</span>` : ''}</li>`).join('');

  return layout({
    title: app.full_name,
    user,
    body: `<a class="small" href="/careers/review">← All applications</a>
    <div class="eyebrow" style="margin:14px 0 6px">${esc(app.reference)} · received ${esc(fmtDate(app.created_at))}</div>
    <h1>${esc(app.full_name)}</h1>
    <div style="margin:6px 0 18px"><span class="pill ${esc(app.status)}">${esc(labelFor(APPLICATION_STATUSES, app.status))}</span> <span class="muted">${esc(roleLabel(app))} · ${esc(labelFor(BRANDS, app.brand))}</span></div>
    ${flash ? `<div class="alert ok">${esc(flash)}</div>` : ''}
    <div class="grid two">
      <div>
        <div class="card"><h2>Candidate</h2><dl class="kv">
          ${dt('Email', `<a href="mailto:${esc(app.email)}">${esc(app.email)}</a>`)}
          ${dt('Phone', `<a href="tel:${esc(app.phone)}">${esc(app.phone)}</a>`)}
          ${dt('Location', esc(`${app.city}, ${labelFor(COUNTRIES, app.country)}`))}
          ${dt('Department', esc(labelFor(DEPARTMENTS, app.department)))}
          ${dt('Role', esc(roleLabel(app)))}
          ${dt('Brand', esc(labelFor(BRANDS, app.brand)))}
          ${dt('Experience', esc(labelFor(EXPERIENCE_BANDS, app.experience_band)))}
          ${dt('Notice period', esc(labelFor(NOTICE_PERIODS, app.notice_period)))}
          ${dt('Key skills', esc(app.skills))}
          ${dt('LinkedIn', link(app.linkedin_url))}
          ${dt('Portfolio', link(app.portfolio_url))}
          ${dt('Consent', esc(fmtDate(app.consent_at)))}
        </dl>
        ${app.introduction ? `<div class="eyebrow" style="margin:16px 0 6px">Introduction</div><pre>${esc(app.introduction)}</pre>` : ''}
        </div>
        ${astro}
        <div class="card" style="margin-top:14px"><h2>CV</h2>
          <p class="muted" style="margin:0 0 10px">${esc(app.cv_filename)} · ${esc((app.cv_size / 1024).toFixed(0))} KB · <span class="dim small">sha256 ${esc(app.cv_sha256.slice(0, 12))}…</span></p>
          <a class="btn" href="/careers/review/applications/${esc(app.id)}/cv">Download CV ↓</a></div>
        ${srcRows ? `<div class="card" style="margin-top:14px"><h2>Recruitment source</h2><dl class="kv">${srcRows}</dl></div>` : ''}
      </div>
      <div>
        <div class="card"><h2>Update status</h2>
          <form method="post" action="/careers/review/applications/${esc(app.id)}/status">
            <label for="status">Status</label><select id="status" name="status" style="margin-bottom:12px">${statusOpts}</select>
            <label for="note">Note (optional)</label><textarea id="note" name="note" rows="3" style="margin-bottom:12px" placeholder="e.g. Screening call on Tuesday"></textarea>
            <button class="btn dark" type="submit">Save →</button>
          </form></div>
        <div class="card" style="margin-top:14px"><h2>Reviewer notes</h2>
          <form method="post" action="/careers/review/applications/${esc(app.id)}/notes">
            <textarea name="reviewer_notes" rows="6" style="margin-bottom:12px">${esc(app.reviewer_notes || '')}</textarea>
            <button class="btn ghost" type="submit">Save notes</button>
          </form></div>
        <div class="card" style="margin-top:14px"><h2>Timeline</h2><ul class="timeline" style="padding-left:16px;margin:0">${timeline || '<li class="dim small">No events yet.</li>'}</ul>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(30,26,61,.08)">
            <div class="eyebrow" style="margin-bottom:4px">Hiring-team email</div>
            ${app.notified_at
              ? `<p class="small muted" style="margin:0">Sent ${esc(fmtDate(app.notified_at))}${app.notify_attempts > 1 ? ` after ${esc(app.notify_attempts)} attempts` : ''}.</p>`
              : app.notify_attempts > 0
                ? `<p class="small" style="margin:0;color:var(--red)">Not sent — ${esc(app.notify_error || 'failed')} (${esc(app.notify_attempts)} attempt${app.notify_attempts === 1 ? '' : 's'}). Retried automatically; the application itself is safely stored.</p>`
                : mailEnabled ? `<p class="small dim" style="margin:0">Pending.</p>` : `<p class="small dim" style="margin:0">Notifications are off on this server.</p>`}
            ${mailEnabled ? `<form method="post" action="/careers/review/applications/${esc(app.id)}/notify" style="margin:8px 0 0"><button class="btn ghost" type="submit">${app.notified_at ? 'Send again' : 'Send now'}</button></form>` : ''}
          </div>
        </div>
      </div>
    </div>`,
  });
}

export function errorPage({ user, status, message }) {
  return layout({ title: `${status}`, user, body: `<div class="card login"><h1 style="font-size:26px">${esc(status)}</h1><p class="muted">${esc(message)}</p><a href="/careers/review">← Back</a></div>` });
}
