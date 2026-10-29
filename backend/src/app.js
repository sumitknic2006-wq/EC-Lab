import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { clientPromise } from './config/db.js';

const app = express();

// Configure trust proxy with a deliberate setting (only in production or when explicitly configured)
if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

// Configure CORS strictly for the client origin with credentials enabled
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// Enforce request body size limit of 50 KB to mitigate payload-based DoS
app.use(express.json({ limit: '50kb' }));

// General API rate limiter (protects server capacity; skips health check)
app.use(generalLimiter);

// Validate session secret before initializing session middleware
const sessionSecret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === 'production') {
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error(
      'FATAL: In production, SESSION_SECRET must be set and contain at least 32 characters.'
    );
  }
}

// Development fallback with explicit length requirement
const activeSecret =
  sessionSecret || 'eclab_development_session_secret_key_minimum_32_characters_long!';

// Configure persistent server-side sessions stored in MongoDB Atlas using the existing Mongoose connection
const sessionStore = MongoStore.create({
  clientPromise,
  collectionName: 'sessions',
  ttl: 7 * 24 * 60 * 60, // 7 days in seconds
  autoRemove: 'native',
});

// Capture session store connection errors gracefully
sessionStore.on('error', (storeError) => {
  console.error('Session store connection error:', storeError.message);
});

app.use(
  session({
    name: 'eclab.sid',
    secret: activeSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/',
    },
  })
);

// Basic health check endpoint (exempt from session/auth requirements)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EC LAB API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes
app.use('/api/v1/auth', authRoutes);

// Public Project Repository Routes (unauthenticated access preserved)
app.use('/api/v1/projects', projectRoutes);

// Catch-all 404 handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error-handling middleware (never leaks stack traces, secrets, or raw database details)
app.use((err, req, res, _next) => {
  // Handle body parser payload too large error
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      status: 'fail',
      message: 'Request payload exceeds 50 KB size limit',
    });
  }

  console.error('Unhandled API error:', err.message || err);

  const statusCode = err.status || 500;
  // In production, mask internal server error messages to prevent database/stack leakage
  const safeMessage =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : err.message || 'Internal server error';

  return res.status(statusCode).json({
    status: 'error',
    message: safeMessage,
  });
});

export default app;
