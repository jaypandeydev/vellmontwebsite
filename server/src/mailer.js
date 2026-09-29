import nodemailer from 'nodemailer';
import { labelFor, BRANDS, ALL_ROLES, EXPERIENCE_BANDS, NOTICE_PERIODS, COUNTRIES } from '../../shared/careersCatalog.js';
import { log, errSummary } from './log.js';

export function createMailer(cfg) {
  if (!cfg.mailConfigured) {
    return { enabled: false, async notifyNewApplication() { return { sent: false, reason: 'mail-not-configured' }; } };
  }
  const transport = nodemailer.createTransport({
    host: cfg.smtp.host,
    port: cfg.smtp.port,
    secure: cfg.smtp.secure,
    auth: cfg.smtp.user ? { user: cfg.smtp.user, pass: cfg.smtp.pass } : undefined,
  });

  return {
    enabled: true,
    async notifyNewApplication(app, cvBuffer) {
      const roleLabel = app.role === 'other' && app.role_other
        ? `Other: ${app.role_other}`
        : labelFor(ALL_ROLES, app.role);
      const reviewUrl = `${cfg.publicBaseUrl}/careers/review/applications/${app.id}`;
      const lines = [
        `New application ${app.reference}`,
        '',
        `Role:        ${roleLabel}`,
        `Brand:       ${labelFor(BRANDS, app.brand)}`,
        `Name:        ${app.full_name}`,
        `Email:       ${app.email}`,
        `Phone:       ${app.phone}`,
        `Location:    ${app.city}, ${labelFor(COUNTRIES, app.country)}`,
        `Experience:  ${labelFor(EXPERIENCE_BANDS, app.experience_band)}`,
        `Notice:      ${labelFor(NOTICE_PERIODS, app.notice_period)}`,
        `Skills:      ${app.skills}`,
        app.linkedin_url ? `LinkedIn:    ${app.linkedin_url}` : null,
        app.portfolio_url ? `Portfolio:   ${app.portfolio_url}` : null,
        app.source && Object.keys(app.source).length ? `Source:      ${JSON.stringify(app.source)}` : null,
        '',
        `Review + CV: ${reviewUrl}`,
      ].filter((l) => l !== null);

      const mail = {
        from: cfg.smtp.from,
        to: cfg.notifyEmail,
        subject: `[Careers] ${roleLabel} — ${app.full_name} (${app.reference})`,
        text: lines.join('\n'),
      };
      if (cfg.notifyAttachCv && cvBuffer) {
        mail.attachments = [{ filename: app.cv_filename, content: cvBuffer, contentType: app.cv_mime }];
      }
      try {
        await transport.sendMail(mail);
        return { sent: true };
      } catch (err) {
        log.error('mail.send_failed', { applicationId: app.id, err: errSummary(err) });
        return { sent: false, reason: err.code || err.name || 'send-failed' };
      }
    },
  };
}
