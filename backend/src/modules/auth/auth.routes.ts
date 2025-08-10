import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword
} from './auth.controller';
import {
  authenticate,
  requireEmailVerification,
  sensitiveOperationLimit
} from './auth.middleware';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
  validateChangePassword,
  validateUpdateProfile
} from './auth.validation';
import { handleValidationErrors } from '../../middlewares/handleValidationErrors';

const router = Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, resetPassword);
router.post('/verify-email', validateVerifyEmail, handleValidationErrors, verifyEmail);

// Protected routes (require authentication)
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateUpdateProfile, handleValidationErrors, updateProfile);

// Password change (requires email verification)
router.post('/change-password', 
  requireEmailVerification,
  sensitiveOperationLimit,
  validateChangePassword,
  handleValidationErrors,
  changePassword
);

export default router;