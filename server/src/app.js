import express from 'express';
import { applicationsRouter } from './routes/applications.js';
import { reviewRouter } from './routes/review.js';
import { createCvStore } from './cvStore.js';
import { createMailer } from './mailer.js';
import { log, errSummary } from './log.js';
import { errorPage } from './views.js';

export async function createApp({ cfg, pool }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', cfg.trustProxy ? 1 : false);

  const cvStore = createCvStore(cfg, pool);
  await cvStore.init();
  const mailer = createMailer(cfg);

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
  app.use('/careers/review', reviewRouter({ cfg, pool, cvStore }));

  app.use((req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ ok: false, message: 'Not found' });
    res.status(404).type('html').send(errorPage({ status: 404, message: 'Not found.' }));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    log.error('unhandled', { p: req.path, err: errSummary(err) });
    if (res.headersSent) return;
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ ok: false, message: 'Something went wrong on our side. Your details are still on this page — please try again.' });
    }
    res.status(500).type('html').send(errorPage({ status: 500, message: 'Something went wrong.' }));
  });

  return { app, cvStore, mailer };
}
