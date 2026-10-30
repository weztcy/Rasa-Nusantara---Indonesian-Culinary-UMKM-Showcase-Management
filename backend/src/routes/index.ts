import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import partnerRoutes from './partner.routes';
import settingsRoutes from './settings.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/partners', partnerRoutes);
apiRouter.use('/settings', settingsRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    database: 'MySQL Laragon connected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default apiRouter;
