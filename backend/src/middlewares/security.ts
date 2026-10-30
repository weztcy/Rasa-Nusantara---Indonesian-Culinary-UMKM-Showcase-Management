import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env';

// Helmet Security Headers
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // For API services
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// CORS Security Configuration
export const corsSecurity = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman) or matching frontend
    if (!origin || origin === ENV.CORS_ORIGIN || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Origin tidak diizinkan oleh kebijakan CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// General API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.NODE_ENV === 'production' ? ENV.RATE_LIMIT_MAX_REQUESTS : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba beberapa saat lagi.',
  },
});

// Stricter Rate Limiter for Authentication endpoints (prevent brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.NODE_ENV === 'production' ? 15 : 100, // relaxed for dev testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan masuk. Demi keamanan, silakan tunggu beberapa saat.',
  },
});
