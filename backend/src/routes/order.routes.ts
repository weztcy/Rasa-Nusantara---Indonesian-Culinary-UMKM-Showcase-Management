import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order.controller';
import { validate } from '../middlewares/validate';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/order.validator';
import { authenticate, requireRole } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public: Customer place order
router.post('/', validate(createOrderSchema), createOrder);

// Protected: Admin & Partner view and manage orders
router.get('/', authenticate, requireRole([Role.ADMIN, Role.PARTNER]), getOrders);
router.get('/:id', authenticate, requireRole([Role.ADMIN, Role.PARTNER]), getOrderById);

router.patch(
  '/:id/status',
  authenticate,
  requireRole([Role.ADMIN, Role.PARTNER]),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

router.delete('/:id', authenticate, requireRole([Role.ADMIN]), deleteOrder);

export default router;
