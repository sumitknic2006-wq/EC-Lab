import { rateLimit } from 'express-rate-limit';

/**
 * Strict rate limiter for authentication endpoints (login, signup).
 * Prevents automated credential stuffing and brute-force attacks.
 * In-memory storage by default (suitable for single-instance deployments; does not offer distributed protection).
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // 15 attempts per 15 minutes per IP
  standardHeaders: true, // Return RateLimit-* headers (RFC standard)
  legacyHeaders: false,
  keyGenerator: (req) => {
    // In non-production test environments, allow isolated probe keys via x-test-client-id
    if (process.env.NODE_ENV !== 'production' && req.headers['x-test-client-id']) {
      return `test_${req.headers['x-test-client-id']}`;
    }
    return req.ip;
  },
  message: {
    status: 'fail',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

/**
 * General API rate limiter.
 * Protects server capacity while exempting health checks and public project browsing.
 * In-memory storage by default (suitable for single-instance deployments; does not offer distributed protection).
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/v1/health' || req.originalUrl?.startsWith('/api/v1/health'),
  message: {
    status: 'fail',
    message: 'Too many requests. Please try again later.',
  },
});

export default {
  authLimiter,
  generalLimiter,
};
