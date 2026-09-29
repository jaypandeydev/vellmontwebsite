import { loadConfig } from './config.js';
import { createPool, migrate } from './db.js';
import { createApp } from './app.js';
import { log, errSummary } from './log.js';

const cfg = loadConfig();
if (cfg.missing.length) {
  process.stderr.write('careers-api cannot start. Missing configuration:\n' + cfg.missing.map((m) => `  - ${m}`).join('\n') + '\nSee server/README.md.\n');
  process.exit(1);
}

const pool = createPool(cfg);
try {
  await migrate(pool);
} catch (err) {
  log.error('db.migrate_failed', { err: errSummary(err) });
  process.exit(1);
}

const { app } = await createApp({ cfg, pool });
const server = app.listen(cfg.port, cfg.host, () => {
  log.info('listening', { host: cfg.host, port: cfg.port, storage: cfg.cvStorage, mail: cfg.mailConfigured, turnstile: Boolean(cfg.turnstileSecret) });
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    log.info('shutdown', { sig });
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
