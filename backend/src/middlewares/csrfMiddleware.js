import crypto from 'crypto';

/**
 * Generates a cryptographically strong 32-byte hex token for CSRF defense.
 * @returns {string}
 */
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Constant-time string comparison to prevent timing attacks on token verification.
 * Validates token string types and non-empty length matching before crypto comparison.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  // Standard token is 32 bytes hex = 64 characters
  if (!a || !b || a.length !== 64 || b.length !== 64) {
    return false;
  }
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * CSRF Protection Middleware for standard authenticated mutating routes.
 * Defends cookie-authenticated state-changing requests using the Synchronizer Token Pattern.
 * - Safe HTTP methods (GET, HEAD, OPTIONS) pass through.
 * - Mutating requests (POST, PUT, PATCH, DELETE) require a matching x-csrf-token header or _csrf field.
 */
export const verifyCsrf = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const clientToken = req.headers['x-csrf-token'] || req.body?._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!sessionToken || !clientToken || !safeCompare(sessionToken, clientToken)) {
    return res.status(403).json({
      status: 'fail',
      message: 'Invalid or missing CSRF token',
    });
  }

  next();
};

/**
 * Login CSRF Protection Middleware.
 * Prevents Login CSRF attacks on pre-existing sessions:
 * If the current session already has a CSRF token assigned (e.g. from an initial page visit),
 * state-changing requests like login/signup MUST provide the matching CSRF token.
 * Fresh unauthenticated clients without an established session token proceed to establish a new session.
 */
export const verifyLoginCsrf = (req, res, next) => {
  if (req.session?.csrfToken) {
    const clientToken = req.headers['x-csrf-token'] || req.body?._csrf;
    if (!clientToken || !safeCompare(req.session.csrfToken, clientToken)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid or missing CSRF token for existing session',
      });
    }
  }
  next();
};

export default {
  generateCsrfToken,
  safeCompare,
  verifyCsrf,
  verifyLoginCsrf,
};
