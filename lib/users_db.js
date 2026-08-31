import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'lib', 'users_db.json');
const RESETS_PATH = path.join(process.cwd(), 'lib', 'password_resets.json');

// ─── LECTURE / ÉCRITURE BASE UTILISATEURS ────────────────────────────────────
export function readUsersDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '[]', 'utf8');
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('[users_db] Erreur lecture users_db.json:', e);
    return [];
  }
}

export function writeUsersDB(users) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('[users_db] Erreur écriture users_db.json:', e);
    return false;
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  const users = readUsersDB();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function updateUserByEmail(email, updates) {
  const users = readUsersDB();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const saved = writeUsersDB(users);
  return saved ? users[index] : null;
}

// ─── HACHAGE & VÉRIFICATION DE MOT DE PASSE ───────────────────────────────
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const inputHash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return inputHash === hash;
}

// ─── GESTION DES TOKENS DE RÉINITIALISATION ──────────────────────────────────
export function readResetsDB() {
  try {
    if (!fs.existsSync(RESETS_PATH)) {
      fs.writeFileSync(RESETS_PATH, '{}', 'utf8');
    }
    const raw = fs.readFileSync(RESETS_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

export function writeResetsDB(resets) {
  try {
    fs.writeFileSync(RESETS_PATH, JSON.stringify(resets, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

export function createPasswordResetToken(email) {
  const resets = readResetsDB();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 3600 * 1000; // Valide 1 heure

  resets[token] = {
    email: email.toLowerCase().trim(),
    expiresAt,
    createdAt: new Date().toISOString()
  };

  writeResetsDB(resets);
  return token;
}

export function verifyResetToken(token) {
  const resets = readResetsDB();
  const record = resets[token];
  if (!record) return { valid: false, reason: "Token inexistant ou déjà utilisé." };

  if (Date.now() > record.expiresAt) {
    delete resets[token];
    writeResetsDB(resets);
    return { valid: false, reason: "Le lien de réinitialisation a expiré." };
  }

  return { valid: true, email: record.email };
}

export function consumeResetToken(token) {
  const resets = readResetsDB();
  delete resets[token];
  writeResetsDB(resets);
}
