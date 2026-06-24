import express from 'express';
import {
	adminLogin,
	forgotPassword,
	loginUser,
	logoutUser,
	refreshToken,
	registerUser,
	resendVerificationEmail,
	verifyEmail
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/refresh-token', refreshToken);
userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/resend-verification-email', resendVerificationEmail);

userRouter.post('/forgot-password', forgotPassword);
// userRouter.post('/reset-password');
userRouter.post('/logout', authUser, logoutUser);
userRouter.post('/admin', adminLogin);

export default userRouter;
