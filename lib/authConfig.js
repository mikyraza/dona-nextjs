/**
 * Canonical Authentication & JWT Configuration for DONA Magazine
 * Single Source of Truth for JWT Secret Keys, Roles, and Session Policies.
 */

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "dona-magazine-super-secret-key-987654321";

export const ALLOWED_ADMIN_ROLES = [
  "Super-Admin",
  "Éditeur",
  "Journaliste",
  "Traducteur",
  "admin"
];

export const AUTH_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";
