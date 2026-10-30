import { Router } from 'express';
import { login, register, getProfile } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth';
import { authLimiter } from '../middlewares/security';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/register', authLimiter, validate(registerSchema), register);
router.get('/me', authenticate, getProfile);

export default router;
