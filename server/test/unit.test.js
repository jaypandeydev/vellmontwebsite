import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, createSessionToken, readSessionToken } from '../src/auth.js';
import { sniffType, safeFilename } from '../src/upload.js';
import { validateApplication } from '../src/validate.js';
import { createLimiter } from '../src/rateLimit.js';

test('password hashing round-trips and rejects wrong input', () => {
  const h = hashPassword('a-long-password-123', { N: 1024 });
  assert.ok(h.startsWith('scrypt$1024$'));
  assert.equal(verifyPassword('a-long-password-123', h), true);
  assert.equal(verifyPassword('a-long-password-124', h), false);
  assert.equal(verifyPassword('x', 'garbage'), false);
});

test('session tokens expire and reject tampering', () => {
  const secret = 's'.repeat(40);
  const tok = createSessionToken({ username: 'r', ttlHours: 1, secret });
  assert.equal(readSessionToken(tok, secret).u, 'r');
  assert.equal(readSessionToken(tok, 'other'.repeat(8)), null);
  assert.equal(readSessionToken(tok, secret, Date.now() + 2 * 3600 * 1000), null);
  const [b64] = tok.split('.');
  assert.equal(readSessionToken(`${b64}.forged`, secret), null);
});

test('magic-byte sniffing', () => {
  assert.equal(sniffType(Buffer.from('%PDF-1.7 xxxxxxxx')), 'pdf');
  assert.equal(sniffType(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0])), 'doc');
  assert.equal(sniffType(Buffer.concat([Buffer.from([0x50, 0x4b, 3, 4]), Buffer.from('....[Content_Types].xml....word/document.xml')])), 'docx');
  assert.equal(sniffType(Buffer.concat([Buffer.from([0x50, 0x4b, 3, 4]), Buffer.from('....random.zip....')])), null);
  assert.equal(sniffType(Buffer.from('MZ\x90\x00 executable')), null);
});

test('filenames are sanitised', () => {
  assert.equal(safeFilename('../../etc/passwd', 'pdf'), 'passwd.pdf');
  assert.equal(safeFilename('Résumé <2026>.docx', 'docx'), 'R_sum_ _2026_.docx');
  assert.equal(safeFilename('', 'pdf'), 'cv.pdf');
});

test('validation normalises phone and drops astrology fields for non-astrologers', () => {
  const r = validateApplication({
    full_name: ' Jane ', email: 'JANE@Example.com', phone: '0091 (987) 654-3210', city: 'Pune', country: 'India',
    role: 'accountant', brand: 'any', experience_band: 'fresher', skills: 'Tally', notice_period: 'immediate', consent: 'yes',
    idempotency_key: '2f1a0c3e-7b8d-4e2a-9f10-1234567890ab', astro_specialisations: ['vedic'],
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.full_name, 'Jane');
  assert.equal(r.data.email, 'jane@example.com');
  assert.equal(r.data.phone, '+919876543210');
  assert.equal(r.data.department, 'people-finance');
  assert.equal(r.data.astro_specialisations, null);
});

test('limiter enforces max per window', () => {
  const l = createLimiter({ windowMs: 1000, max: 2 });
  assert.equal(l.hit('a', 0).allowed, true);
  assert.equal(l.hit('a', 10).allowed, true);
  assert.equal(l.hit('a', 20).allowed, false);
  assert.equal(l.hit('a', 1100).allowed, true);
});
