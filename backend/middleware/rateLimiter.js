import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
	standardHeaders: true,
	legacyHeaders: false,
});

export const registerLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
	message: { success: false, message: 'Too many registration attempts, please try again after 15 minutes' },
	standardHeaders: true,
	legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
	message: { success: false, message: 'Too many password reset attempts, please try again after 15 minutes' },
	standardHeaders: true,
	legacyHeaders: false,
});

export const resendVerificationLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
	message: { success: false, message: 'Too many verification email requests, please try again after 15 minutes' },
	standardHeaders: true,
	legacyHeaders: false,
});
