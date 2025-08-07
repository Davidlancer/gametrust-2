import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from './auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Social authentication routes
router.post('/google', AuthController.googleAuth);
router.post('/apple', AuthController.appleAuth);

// Protected routes
router.post('/logout', protect, AuthController.logout);
router.post('/logout-all', protect, AuthController.logoutAll);
router.get('/me', protect, AuthController.getProfile);
router.put('/me', protect, AuthController.updateProfile);
router.get('/sessions', protect, AuthController.getSessions);
router.delete('/sessions/:sessionId', protect, AuthController.deleteSession);

// Email verification
router.post('/verify-email', protect, AuthController.sendVerificationEmail);
router.post('/verify-email/confirm', AuthController.verifyEmail);

// Password reset
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;