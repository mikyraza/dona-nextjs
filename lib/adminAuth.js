import { getToken } from 'next-auth/jwt';
import { dbGetUserById, dbGetUserByEmail } from './db.js';
import { NEXTAUTH_SECRET, ALLOWED_ADMIN_ROLES } from './authConfig.js';

export { NEXTAUTH_SECRET, ALLOWED_ADMIN_ROLES };

/**
 * Validates whether the incoming Next.js API request has an active, authenticated
 * administrative session with authorized roles.
 * 
 * Strict Token Verification: Never unconditionally bypasses token check.
 * 
 * @param {Request} req - Incoming Next.js API Request
 * @param {string[]} [customRoles] - Optional subset of permitted admin roles
 * @returns {Promise<{ authorized: boolean, token?: Object, user?: Object, error?: string, status?: number }>}
 */
export async function validateAdminSession(req, customRoles = ALLOWED_ADMIN_ROLES) {
  try {
    const token = await getToken({
      req,
      secret: NEXTAUTH_SECRET
    });

    if (!token) {
      return {
        authorized: false,
        status: 401,
        error: "Authentification administrative requise. Aucun jeton valide fourni."
      };
    }

    // Check role authorization
    const role = token.role || 'USER';
    const isAllowedRole = customRoles.includes(role) || (role && role.toLowerCase() === 'admin');

    if (!isAllowedRole) {
      return {
        authorized: false,
        status: 403,
        error: `Accès interdit : le rôle [${role}] n'a pas les privilèges requis.`
      };
    }

    // Check account status directly in DB if ID/email is present
    if (token.id || token.email) {
      const dbUser = (token.id ? dbGetUserById(token.id) : null) || (token.email ? dbGetUserByEmail(token.email) : null);
      if (dbUser && dbUser.status === 'Suspendu') {
        return {
          authorized: false,
          status: 403,
          error: "Compte administrateur suspendu."
        };
      }
    }

    return {
      authorized: true,
      token,
      status: 200
    };
  } catch (err) {
    console.error('[AdminAuth] Error validating admin token:', err);
    return {
      authorized: false,
      status: 401,
      error: "Erreur lors de la validation du jeton d'authentification."
    };
  }
}
