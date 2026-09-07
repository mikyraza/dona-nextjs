import path from 'path';

/**
 * Whitelist of allowed MIME types and their permitted file extensions.
 */
export const ALLOWED_MEDIA_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/jpg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/svg+xml': ['.svg'],
  'image/avif': ['.avif'],

  // Videos
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv'],
  'video/quicktime': ['.mov'],

  // Audios
  'audio/mpeg': ['.mp3'],
  'audio/mp3': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-wav': ['.wav'],
  'audio/aac': ['.aac'],
  'audio/ogg': ['.ogg'],
  'audio/m4a': ['.m4a'],
  'audio/x-m4a': ['.m4a'],
  'audio/mp4': ['.m4a', '.mp4'],

  // Documents
  'application/pdf': ['.pdf']
};

export const BLOCKED_EXTENSIONS = new Set([
  '.php', '.php3', '.php4', '.php5', '.phtml', '.phar',
  '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx',
  '.exe', '.dll', '.so', '.bin', '.cmd', '.bat', '.ps1', '.vbs', '.sh',
  '.html', '.htm', '.xhtml', '.jsp', '.asp', '.aspx', '.cgi', '.pl',
  '.py', '.rb', '.jar', '.war', '.env', '.config', '.htaccess'
]);

/**
 * Inspects buffer magic bytes to verify actual content signature.
 */
export function verifyMagicBytes(buffer, declaredMime, extension) {
  if (!buffer || buffer.length < 4) return false;

  const hex = buffer.subarray(0, 16).toString('hex').toLowerCase();

  // JPEG
  if (hex.startsWith('ffd8ff')) return true;

  // PNG
  if (hex.startsWith('89504e470d0a1a0a')) return true;

  // GIF
  if (hex.startsWith('47494638')) return true;

  // WEBP (RIFF....WEBP)
  if (hex.startsWith('52494646') && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return true;

  // PDF (%PDF)
  if (hex.startsWith('25504446')) return true;

  // MP4 / MOV / M4A (ftyp at offset 4)
  if (buffer.length >= 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp') return true;

  // MP3 (ID3 or frame sync FF FB / FF FA / FF F3 / FF F2)
  if (hex.startsWith('494433') || hex.startsWith('fffb') || hex.startsWith('fffa') || hex.startsWith('fff3') || hex.startsWith('fff2')) return true;

  // WAV (RIFF....WAVE)
  if (hex.startsWith('52494646') && buffer.subarray(8, 12).toString('ascii') === 'WAVE') return true;

  // SVG (XML or SVG tag, sanitized)
  if (declaredMime === 'image/svg+xml' || extension === '.svg') {
    const textSample = buffer.subarray(0, Math.min(buffer.length, 2048)).toString('utf8').toLowerCase();
    if (textSample.includes('<svg') || textSample.includes('<?xml')) {
      // Check for script injection in SVG
      if (textSample.includes('<script') || textSample.includes('javascript:') || textSample.includes('onload=') || textSample.includes('onerror=')) {
        return false;
      }
      return true;
    }
  }

  // WebM / Matroska (1A 45 DF A3)
  if (hex.startsWith('1a45dfa3')) return true;

  // OGG (OggS)
  if (hex.startsWith('4f676753')) return true;

  return false;
}

/**
 * Validates file MIME type, extension, and content signature.
 * 
 * @param {string} fileName - Original filename
 * @param {string} mimeType - Declared MIME type
 * @param {Buffer} [buffer] - Optional file content buffer for magic byte inspection
 * @returns {{ isValid: boolean, error?: string, sanitizedExt?: string, category?: string }}
 */
export function validateMediaFile(fileName, mimeType, buffer = null) {
  if (!fileName || typeof fileName !== 'string') {
    return { isValid: false, error: "Nom de fichier invalide." };
  }

  const ext = path.extname(fileName).toLowerCase();

  // 1. Check prohibited dangerous extensions
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { isValid: false, error: `Type de fichier non autorisé : l'extension [${ext}] est strictement bloquée pour des raisons de sécurité.` };
  }

  // 2. Normalize and check declared MIME type
  const normMime = (mimeType || '').trim().toLowerCase();
  const allowedExtensions = ALLOWED_MEDIA_TYPES[normMime];

  if (!allowedExtensions && !ext) {
    return { isValid: false, error: "Type MIME ou extension non reconnu." };
  }

  // If MIME is known, check if extension matches
  if (allowedExtensions && ext && !allowedExtensions.includes(ext)) {
    // Check if extension belongs to any other allowed media type
    const isExtensionAllowedSomewhere = Object.values(ALLOWED_MEDIA_TYPES).some(exts => exts.includes(ext));
    if (!isExtensionAllowedSomewhere) {
      return { isValid: false, error: `Incohérence entre le type MIME (${normMime}) et l'extension (${ext}).` };
    }
  }

  // If MIME is unknown (e.g. application/octet-stream), check if extension is allowed
  if (!allowedExtensions) {
    const matchingEntry = Object.entries(ALLOWED_MEDIA_TYPES).find(([_, exts]) => exts.includes(ext));
    if (!matchingEntry) {
      return { isValid: false, error: `L'extension [${ext}] n'est pas autorisée.` };
    }
  }

  // 3. Magic bytes verification when buffer is available
  if (buffer && buffer.length >= 4) {
    const isMagicValid = verifyMagicBytes(buffer, normMime, ext);
    if (!isMagicValid) {
      return { isValid: false, error: "La signature interne du fichier ne correspond pas à un format média autorisé." };
    }
  }

  const finalExt = ext || (allowedExtensions ? allowedExtensions[0] : '.jpg');
  return {
    isValid: true,
    sanitizedExt: finalExt
  };
}
