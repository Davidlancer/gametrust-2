import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validation';
import { validateSchema } from '../../middlewares/validation.middleware';
import { protect } from './auth.middleware';

const router = Router();

// Public routes
router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);

export default router;