import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { validate, validateQuery } from '../middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
  queryProductSchema,
} from '../validators/product.validator';
import { authenticate, requireRole } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', validateQuery(queryProductSchema), getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin & Partner)
router.post(
  '/',
  authenticate,
  requireRole([Role.ADMIN, Role.PARTNER]),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  requireRole([Role.ADMIN, Role.PARTNER]),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  requireRole([Role.ADMIN, Role.PARTNER]),
  deleteProduct
);

export default router;
