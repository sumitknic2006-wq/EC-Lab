import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { toPublicUserDTO } from '../utils/userDTO.js';
import { generateCsrfToken } from '../middlewares/csrfMiddleware.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const BCRYPT_ROUNDS = 12;

/**
 * Standard cookie configuration matching the session cookie options.
 */
export const getCookieOptions = () => ({
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || 'lax',
});

/**
 * GET /api/v1/auth/csrf-token
 * Issues or returns the synchronizer CSRF token bound to the current session.
 */
export const getCsrfToken = (req, res) => {
  if (!req.session) {
    return res.status(500).json({
      status: 'error',
      message: 'Session subsystem unavailable',
    });
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  return res.status(200).json({
    status: 'success',
    data: {
      csrfToken: req.session.csrfToken,
    },
  });
};

/**
 * POST /api/v1/auth/signup
 * Registers a new academic student account. Public signup is strictly student-only.
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, department, rollNumber } = req.body || {};

    // 1. Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name must be between 2 and 100 characters',
      });
    }

    // 2. Validate email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid academic email address',
      });
    }

    // 3. Validate password complexity (8–128 chars, 1 uppercase, 1 lowercase, 1 number)
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Password is required',
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be between 8 and 128 characters',
      });
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLower || !hasUpper || !hasNumber) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must include at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanDepartment =
      typeof department === 'string' && department.trim()
        ? department.trim()
        : 'Electronics & Communication Engineering';
    const cleanRollNumber =
      typeof rollNumber === 'string' && rollNumber.trim()
        ? rollNumber.trim().toUpperCase()
        : undefined;

    // 4. Hash password with bcrypt cost factor 12
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 5. Create user strictly enforcing student role and initial defaults
    // Client-supplied role, isActive, isEmailVerified, permissions are completely discarded
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: 'student',
      department: cleanDepartment,
      rollNumber: cleanRollNumber,
      isActive: true,
      isEmailVerified: false,
    });

    // 6. Establish fresh session on signup (prevent session fixation)
    const newCsrfToken = generateCsrfToken();

    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }

      req.session.userId = String(user._id);
      req.session.csrfToken = newCsrfToken;

      req.session.save((saveErr) => {
        if (saveErr) {
          return next(saveErr);
        }

        return res.status(201).json({
          status: 'success',
          message: 'Account registered successfully',
          data: {
            user: toPublicUserDTO(user),
            csrfToken: newCsrfToken,
          },
        });
      });
    });
  } catch (error) {
    // Handle MongoDB unique index violations without exposing database internals
    if (error.code === 11000) {
      if (error.keyPattern?.email || error.message?.includes('email')) {
        return res.status(409).json({
          status: 'fail',
          message: 'An account with this email already exists',
        });
      }
      if (error.keyPattern?.rollNumber || error.message?.includes('rollNumber')) {
        return res.status(409).json({
          status: 'fail',
          message: 'An account with this roll number already exists',
        });
      }
      return res.status(409).json({
        status: 'fail',
        message: 'Account credentials conflict with an existing record',
      });
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        status: 'fail',
        message: messages.join(', '),
      });
    }

    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Authenticates user credentials and establishes a fresh session.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Explicitly select passwordHash since it is marked select: false in schema
    const user = await User.findOne({ email: cleanEmail }).select('+passwordHash');

    // Generic failure message for unknown email, incorrect password, or inactive account
    if (!user || user.isActive === false) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // Regenerate session ID to prevent session fixation attacks
    const newCsrfToken = generateCsrfToken();

    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }

      req.session.userId = String(user._id);
      req.session.csrfToken = newCsrfToken;

      req.session.save((saveErr) => {
        if (saveErr) {
          return next(saveErr);
        }

        return res.status(200).json({
          status: 'success',
          message: 'Authenticated successfully',
          data: {
            user: toPublicUserDTO(user),
            csrfToken: newCsrfToken,
          },
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 * Retrieves profile of the currently authenticated user based on session.
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required',
      });
    }

    // Always fetch directly from MongoDB to verify account is still active and valid
    const user = await User.findById(req.session.userId).lean();

    if (!user) {
      req.session.destroy(() => {});
      res.clearCookie('eclab.sid', getCookieOptions());
      return res.status(401).json({
        status: 'fail',
        message: 'Account not found',
      });
    }

    if (user.isActive === false) {
      req.session.destroy(() => {});
      res.clearCookie('eclab.sid', getCookieOptions());
      return res.status(401).json({
        status: 'fail',
        message: 'Account is inactive',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: toPublicUserDTO(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 * Destroys the server-side session and clears the session cookie.
 */
export const logout = (req, res) => {
  const cookieOptions = getCookieOptions();

  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session during logout:', err);
      }
      res.clearCookie('eclab.sid', cookieOptions);
      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    });
  } else {
    res.clearCookie('eclab.sid', cookieOptions);
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }
};

export default {
  getCsrfToken,
  signup,
  login,
  getMe,
  logout,
  getCookieOptions,
};
