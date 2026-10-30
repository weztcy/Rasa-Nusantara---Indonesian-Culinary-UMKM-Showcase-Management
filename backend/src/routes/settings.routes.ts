import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { validate } from '../middlewares/validate';
import { updateStoreSettingsSchema } from '../validators/settings.validator';
import { authenticate, requireRole } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public: View platform settings & contacts
router.get('/', getSettings);

// Protected: Admin update settings
router.put(
  '/',
  authenticate,
  requireRole([Role.ADMIN]),
  validate(updateStoreSettingsSchema),
  updateSettings
);

export default router;
