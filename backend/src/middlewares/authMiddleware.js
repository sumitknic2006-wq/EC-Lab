import User from '../models/User.js';
import { getCookieOptions } from '../controllers/authController.js';

/**
 * Authentication Middleware
 * Enforces session authentication and validates user against MongoDB.
 * Rejects unauthenticated, deleted, or inactive accounts.
 */
export const requireAuth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required',
      });
    }

    // Always fetch latest role and status from database (never trust stale session)
    const user = await User.findById(req.session.userId).lean();

    if (!user) {
      req.session.destroy(() => {});
      res.clearCookie('eclab.sid', getCookieOptions());
      return res.status(401).json({
        status: 'fail',
        message: 'User account not found',
      });
    }

    if (user.isActive === false) {
      req.session.destroy(() => {});
      res.clearCookie('eclab.sid', getCookieOptions());
      return res.status(401).json({
        status: 'fail',
        message: 'User account is inactive',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-Based Authorization Middleware Factory
 * Ensures authenticated user possesses one of the allowed roles.
 * Must be used after requireAuth.
 *
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'faculty')
 * @returns {import('express').RequestHandler}
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied: insufficient permissions',
      });
    }

    next();
  };
};

export default {
  requireAuth,
  requireRole,
};
