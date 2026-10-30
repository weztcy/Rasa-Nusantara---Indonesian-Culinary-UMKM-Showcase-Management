import express, { Express } from 'express';
import morgan from 'morgan';
import { securityHeaders, corsSecurity, apiLimiter } from './middlewares/security';
import { notFoundHandler, globalErrorHandler } from './middlewares/errorHandler';
import apiRouter from './routes';

export function createApp(): Express {
  const app = express();

  // Security Middlewares
  app.use(securityHeaders);
  app.use(corsSecurity);
  app.use('/api', apiLimiter);

  // Logging & Parsing
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root & Health Check Endpoints
  app.get('/', (req, res) => {
    res.json({
      success: true,
      service: 'RasaNusantara UMKM Food Showcase API',
      version: '1.0.0',
      database: 'MySQL via Prisma ORM',
      documentation: '/api/docs',
      health: '/health',
    });
  });

  app.get('/health', (req, res) => {
    res.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API modules under /api
  app.use('/api', apiRouter);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
