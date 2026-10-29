import { Router } from 'express';
import {
  signup,
  login,
  getMe,
  logout,
  getCsrfToken,
} from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { verifyCsrf, verifyLoginCsrf } from '../middlewares/csrfMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

/**
 * Authentication Routes (/api/v1/auth)
 */

// CSRF token retrieval for synchronizer token pattern
router.get('/csrf-token', getCsrfToken);

// Public Student Registration (strictly assigns student role; defends against login/signup CSRF)
router.post('/signup', authLimiter, verifyLoginCsrf, signup);

// User Authentication (establishes fresh session; defends against login CSRF)
router.post('/login', authLimiter, verifyLoginCsrf, login);

// Current User Profile (verified against MongoDB)
router.get('/me', requireAuth, getMe);

// Session Termination (CSRF protected)
router.post('/logout', verifyCsrf, logout);

export default router;
