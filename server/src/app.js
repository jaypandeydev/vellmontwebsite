import express from 'express';
import { applicationsRouter } from './routes/applications.js';
import { reviewRouter } from './routes/review.js';
import { createCvStore } from './cvStore.js';
import { createMailer } from './mailer.js';
import { log, errSummary } from './log.js';
import { isDbUnavailable } from './db.js';
import { startNotificationSweeper } from './notifications.js';
import { errorPage } from './views.js';

export async function createApp({ cfg, pool, mailer: mailerOverride }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', cfg.trustProxy ? 1 : false);

  const cvStore = createCvStore(cfg, pool);
  await cvStore.init();
  const mailer = mailerOverride || createMailer(cfg);
  const sweeper = startNotificationSweeper({ pool, mailer, cfg, cvStore });

  // Request log: method, path (no query string), status, duration. Never bodies.
  app.use((req, res, next) => {
    const started = process.hrtime.bigint();
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - started) / 1e6;
      log.info('http', { m: req.method, p: req.path, s: res.statusCode, ms: Math.round(ms) });
    });
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  app.use('/api/careers', applicationsRouter({ cfg, pool, cvStore, mailer }));
  app.use('/careers/review', reviewRouter({ cfg, pool, cvStore, mailer }));

  app.use((req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ ok: false, message: 'Not found' });
    res.status(404).type('html').send(errorPage({ status: 404, message: 'Not found.' }));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const unavailable = isDbUnavailable(err);
    log.error(unavailable ? 'db.unavailable' : 'unhandled', { p: req.path, err: errSummary(err) });
    if (res.headersSent) return;
    const status = unavailable ? 503 : 500;
    if (unavailable) res.setHeader('Retry-After', '30');
    if (req.path.startsWith('/api/')) {
      return res.status(status).json({
        ok: false,
        message: unavailable
          ? 'We could not save your application right now. Your details are still on this page — please try again in a moment.'
          : 'Something went wrong on our side. Your details are still on this page — please try again.',
      });
    }
    res.status(status).type('html').send(errorPage({ status, message: unavailable ? 'The database is temporarily unavailable. Please try again shortly.' : 'Something went wrong.' }));
  });

  return { app, cvStore, mailer, sweeper };
}
