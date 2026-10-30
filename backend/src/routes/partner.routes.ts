import { Router } from 'express';
import {
  submitPartner,
  getPartners,
  updatePartnerStatus,
} from '../controllers/partner.controller';
import { validate } from '../middlewares/validate';
import {
  createPartnerSubmissionSchema,
  updatePartnerStatusSchema,
} from '../validators/partner.validator';
import { authenticate, requireRole } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public: Submit partner application
router.post('/', validate(createPartnerSubmissionSchema), submitPartner);

// Protected: Admin review applications
router.get('/', authenticate, requireRole([Role.ADMIN]), getPartners);

router.patch(
  '/:id/status',
  authenticate,
  requireRole([Role.ADMIN]),
  validate(updatePartnerStatusSchema),
  updatePartnerStatus
);

export default router;
