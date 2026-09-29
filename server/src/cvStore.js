import fs from 'node:fs/promises';
import path from 'node:path';

// Two interchangeable CV stores. Both keep files private: 'db' writes bytea
// rows in Postgres (survives deploys, backed up with the DB); 'fs' writes to a
// directory outside the web root with owner-only permissions.

export function createCvStore(cfg, pool) {
  if (cfg.cvStorage === 'fs') {
    const dir = path.resolve(cfg.cvStorageDir);
    return {
      kind: 'fs',
      async init() {
        await fs.mkdir(dir, { recursive: true, mode: 0o700 });
      },
      // Called INSIDE the insert transaction so a failed write rolls back.
      async put(client, applicationId, ext, buffer) {
        const rel = `${applicationId}.${ext}`;
        await fs.writeFile(path.join(dir, rel), buffer, { mode: 0o600, flag: 'wx' });
        return rel;
      },
      async get(app) {
        if (!app.cv_path || app.cv_path.includes('/') || app.cv_path.includes('..')) return null;
        try {
          return await fs.readFile(path.join(dir, app.cv_path));
        } catch (err) {
          if (err.code === 'ENOENT') return null;
          throw err;
        }
      },
      async remove(app) {
        if (!app.cv_path) return;
        await fs.rm(path.join(dir, app.cv_path), { force: true });
      },
    };
  }
  return {
    kind: 'db',
    async init() {},
    async put(client, applicationId, _ext, buffer) {
      await client.query('INSERT INTO careers_cv_blobs (application_id, data) VALUES ($1, $2)', [applicationId, buffer]);
      return null;
    },
    async get(app) {
      const r = await pool.query('SELECT data FROM careers_cv_blobs WHERE application_id = $1', [app.id]);
      return r.rows[0] ? r.rows[0].data : null;
    },
    async remove() {},
  };
}
