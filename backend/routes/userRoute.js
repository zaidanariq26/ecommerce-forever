import express from 'express';
import {
	adminLogin,
	forgotPassword,
	loginUser,
	logoutUser,
	refreshToken,
	registerUser,
	resendVerificationEmail,
	resetPassword,
	verifyEmail,
	getProfile,
	updateProfile
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import {
	loginLimiter,
	registerLimiter,
	forgotPasswordLimiter,
	resendVerificationLimiter
} from '../middleware/rateLimiter.js';

const userRouter = express.Router();

userRouter.post('/refresh-token', refreshToken);
userRouter.post('/login', loginLimiter, loginUser);
userRouter.post('/register', registerLimiter, registerUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/resend-verification-email', resendVerificationLimiter, resendVerificationEmail);

userRouter.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
userRouter.patch('/reset-password', resetPassword);
userRouter.post('/logout', authUser, logoutUser);
userRouter.get('/profile', authUser, getProfile);
userRouter.put('/profile', authUser, updateProfile);
userRouter.post('/admin', loginLimiter, adminLogin);

export default userRouter;
