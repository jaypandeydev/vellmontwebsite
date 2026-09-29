import multer from 'multer';
import path from 'node:path';
import { CV_MAX_BYTES, CV_ALLOWED_EXTENSIONS, CV_ALLOWED_MIME } from '../../shared/careersCatalog.js';

export const CV_FIELD = 'cv';

export function extensionOf(filename) {
  return path.extname(filename || '').slice(1).toLowerCase();
}

// Strip path separators and control characters; keep a sane length.
export function safeFilename(original, ext) {
  const base = path.basename(String(original || 'cv'), path.extname(String(original || '')));
  const cleaned = base.replace(/[^A-Za-z0-9._ -]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80) || 'cv';
  return `${cleaned}.${ext}`;
}

// Magic-byte sniffing so a renamed executable can't be uploaded as a "PDF".
export function sniffType(buf) {
  if (!buf || buf.length < 8) return null;
  if (buf.slice(0, 5).toString('latin1') === '%PDF-') return 'pdf';
  // OLE compound document (legacy .doc)
  if (buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0 && buf[4] === 0xa1 && buf[5] === 0xb1) return 'doc';
  // ZIP container (docx). We additionally require "word/" to appear in the
  // first chunk of the central directory names to reject arbitrary zips.
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    const head = buf.slice(0, Math.min(buf.length, 64 * 1024)).toString('latin1');
    if (head.includes('word/') || head.includes('[Content_Types].xml')) return 'docx';
    return null;
  }
  return null;
}

export const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: CV_MAX_BYTES,
    files: 1,
    fields: 60,
    fieldSize: 20 * 1024,
    parts: 80,
  },
  fileFilter(req, file, cb) {
    const ext = extensionOf(file.originalname);
    if (!CV_ALLOWED_EXTENSIONS.includes(ext)) {
      const err = new Error('Unsupported CV format');
      err.code = 'CV_TYPE';
      return cb(err);
    }
    // Browsers occasionally send octet-stream for .doc; be lenient here and
    // rely on magic bytes downstream.
    if (file.mimetype && !CV_ALLOWED_MIME.includes(file.mimetype) && file.mimetype !== 'application/octet-stream') {
      const err = new Error('Unsupported CV format');
      err.code = 'CV_TYPE';
      return cb(err);
    }
    cb(null, true);
  },
});

/**
 * Validate the parsed upload. Returns { ok, error?, ext?, mime? }.
 */
export function checkCv(file) {
  if (!file) return { ok: false, error: 'Please attach your CV.' };
  if (file.size > CV_MAX_BYTES) return { ok: false, error: 'CV is larger than 5 MB.' };
  if (file.size < 100) return { ok: false, error: 'That file looks empty. Please upload your CV.' };
  const ext = extensionOf(file.originalname);
  const sniffed = sniffType(file.buffer);
  if (!sniffed) return { ok: false, error: 'CV must be a real PDF, DOC or DOCX file.' };
  // Allow .doc/.docx cross-labelling only within Word family, never PDF<->Word.
  const wordFamily = ['doc', 'docx'];
  const consistent = sniffed === ext || (wordFamily.includes(sniffed) && wordFamily.includes(ext));
  if (!consistent) return { ok: false, error: 'CV file contents do not match its extension.' };
  const mime = CV_ALLOWED_MIME[['pdf', 'doc', 'docx'].indexOf(sniffed)];
  return { ok: true, ext: sniffed, mime };
}
