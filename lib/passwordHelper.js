import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Checks if a string is already a valid bcrypt hash
 */
export function isBcryptHash(str) {
  if (typeof str !== 'string') return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

/**
 * Hash a plain text password with Bcrypt (salt rounds: 10)
 * Falls back to crypto scrypt if bcryptjs is not loaded
 */
export function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    return plainPassword;
  }

  // If already hashed, don't rehash
  if (isBcryptHash(plainPassword)) {
    return plainPassword;
  }

  if (bcrypt && bcrypt.hashSync) {
    try {
      return bcrypt.hashSync(plainPassword, 10);
    } catch (err) {
      console.warn('[PasswordHelper] bcryptjs hashing error, using crypto fallback:', err.message);
    }
  }

  // Fallback: Node.js crypto scrypt hashing
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainPassword, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verify a plain text password against a stored hash or legacy plain text
 * @returns {{ match: boolean, needsRehash: boolean }}
 */
export function verifyPassword(plainPassword, storedHash) {
  if (!plainPassword || !storedHash) {
    return { match: false, needsRehash: false };
  }

  // 1. Bcrypt Hash verification
  if (isBcryptHash(storedHash)) {
    if (bcrypt && bcrypt.compareSync) {
      try {
        const match = bcrypt.compareSync(plainPassword, storedHash);
        return { match, needsRehash: false };
      } catch (e) {
        return { match: false, needsRehash: false };
      }
    }
  }

  // 2. Scrypt fallback verification
  if (typeof storedHash === 'string' && storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length === 3) {
      const salt = parts[1];
      const originalKey = parts[2];
      const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
      const match = crypto.timingSafeEqual(Buffer.from(derivedKey, 'hex'), Buffer.from(originalKey, 'hex'));
      return { match, needsRehash: false };
    }
  }

  // 3. Legacy Plain Text Comparison (supports existing seeded dev accounts & signals re-hash)
  if (plainPassword === storedHash) {
    return { match: true, needsRehash: true };
  }

  return { match: false, needsRehash: false };
}

/**
 * Generates a clean, collision-resistant secure identifier
 * Example: "usr_a1b2c3d4e5f6" or "mem_f9e8d7c6b5a4"
 */
export function generateSecureId(prefix = 'usr') {
  const randomHex = crypto.randomBytes(8).toString('hex');
  return `${prefix}_${randomHex}`;
}
