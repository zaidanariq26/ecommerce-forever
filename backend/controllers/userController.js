import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail, sendVerificationEmail } from '../services/emailService.js';

const createAccessToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: '15m'
	});
};

const createRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: '7d'
	});
};

const refreshToken = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			return res.status(401).json({ success: false, message: 'No refresh token' });
		}

		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		const user = await userModel.findById(decoded.id);
		if (!user) {
			return res.status(401).json({ success: false, message: 'User not found' });
		}

		const accessToken = createAccessToken(user._id, user.role);

		res.status(200).json({
			success: true,
			accessToken,
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.log(error.message);
		res.status(401).json({ success: false, message: 'Invalid refresh token' });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Input validation
		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Email and password are required' });
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ success: false, message: 'Invalid email format' });
		}

		// User check
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}

		// Password check
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}

		// Check user verified
		if (!user.isVerified) {
			return res
				.status(403)
				.json({ success: false, message: 'Please verify your email first', errorType: 'EMAIL_NOT_VERIFIED' });
		}

		// Generate tokens
		const accessToken = createAccessToken(user._id, user.role);
		const refreshToken = createRefreshToken(user._id);

		// Save refresh token at httpOnly cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		// Send access token to the client
		res.status(200).json({
			success: true,
			accessToken,
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		// Validate input
		if (!firstName || !email || !password) {
			return res.status(400).json({ success: false, message: 'All fields are required' });
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ success: false, message: 'Invalid email format' });
		}

		if (password.length < 8) {
			return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
		}

		// Check email that is already registered
		const user = await userModel.findOne({ email: email.toLowerCase().trim() });

		if (user) {
			if (user.isVerified) {
				return res.status(409).json({
					success: false,
					message: 'Email already registered'
				});
			}

			// Jika belum verified
			return res.status(403).json({
				success: false,
				message: 'This email is registered but not verified yet',
				errorType: 'EMAIL_NOT_VERIFIED'
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate verification token
		const verifyToken = crypto.randomBytes(32).toString('hex');
		const verifyTokenExpiry = Date.now() + 15 * 60 * 1000;

		// Save user data
		const newUser = await userModel.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			isVerified: false,
			verifyToken,
			verifyTokenExpiry
		});

		try {
			await sendVerificationEmail(email, verifyToken);
		} catch (emailError) {
			console.error('Failed to send reset verification email:', emailError);

			newUser.verifyToken = undefined;
			newUser.verifyTokenExpiry = undefined;
			await newUser.save();

			return res.status(502).json({
				success: false,
				message: "We couldn't send the verification email right now. Please try again in a moment."
			});
		}

		res.status(201).json({
			success: true,
			message: 'Registration successful, please check your email to verify your account'
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;

		const user = await userModel.findOne({
			verifyToken: token,
			verifyTokenExpiry: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
		}

		// Update user
		user.isVerified = true;
		user.verifyToken = undefined;
		user.verifyTokenExpiry = undefined;
		await user.save();

		// Auto-login — generate tokens
		const accessToken = createAccessToken(user._id, user.role);
		const refreshToken = createRefreshToken(user._id);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		res.status(200).json({
			success: true,
			accessToken,
			message: 'Email verified successfully',
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const resendVerificationEmail = async (req, res) => {
	try {
		const { token, email } = req.body;

		if (!token && !email) {
			return res.status(400).json({
				success: false,
				message: 'Please provide either a token or an email address.'
			});
		}

		const query = {};
		if (token) query.verifyToken = token;
		if (email) query.email = email;

		console.log(query);

		const user = await userModel.findOne(query);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Account not found or the link is invalid. Please double-check!'
			});
		}

		if (user.isVerified) {
			return res.status(400).json({
				success: false,
				message: 'Email already verified'
			});
		}

		// Generate new token
		user.verifyToken = crypto.randomBytes(32).toString('hex');
		// user.verifyTokenExpiry = Date.now() + 15 * 60 * 1000;
		user.verifyTokenExpiry = Date.now();
		await user.save();

		// Send verification email
		try {
			await sendVerificationEmail(user.email, user.verifyToken);
		} catch (emailError) {
			console.error('Failed to send verification email:', emailError);

			user.verifyToken = undefined;
			user.verifyTokenExpiry = undefined;
			await user.save();

			return res.status(502).json({
				success: false,
				message: "We couldn't send the verification email right now. Please try again in a moment."
			});
		}

		res.status(200).json({
			success: true,
			message: 'Verification email has been resent, please check your email'
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				messsage: 'Email is required'
			});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({
				success: false,
				message: 'Please enter a valid email'
			});
		}

		const user = await userModel.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Email is not available'
			});
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetTokenExpiry = Date.now() + 5 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordTokenExpiry = resetTokenExpiry;
		await user.save();

		try {
			await sendResetPasswordEmail(user.email, resetToken);
		} catch (emailError) {
			console.error('Failed to send reset password email:', emailError);

			user.resetPasswordToken = undefined;
			user.resetPasswordTokenExpiry = undefined;
			await user.save();

			return res.status(502).json({
				success: false,
				message: "We couldn't send the reset email right now. Please try again in a moment."
			});
		}

		res.status(200).json({
			success: true,
			message: 'Reset link has been sent successfully'
		});
	} catch (error) {
		console.error('forgotPassword error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token, password, passwordConfirmation } = req.body;

		// Validate inputs
		if (!token) {
			return res.status(400).json({
				success: false,
				message: 'Reset token is required'
			});
		}

		if (!password || !passwordConfirmation) {
			return res.status(400).json({
				success: false,
				message: 'Password and confirmation are required'
			});
		}

		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				message: 'Password must be at least 8 characters'
			});
		}

		if (password !== passwordConfirmation) {
			return res.status(400).json({
				success: false,
				message: 'Passwords do not match'
			});
		}

		// Check if user is available
		const user = await userModel.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpiry: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid or expired reset link'
			});
		}

		// Hashed password
		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpiry = undefined;
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Password reset successfully, please login with your new password'
		});
	} catch (error) {
		console.error('resetPassword error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

const logoutUser = (req, res) => {
	if (!req.user) {
		return res.status(401).json({ success: false, message: 'Not authenticated' });
	}

	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict'
	});
	res.status(200).json({ success: true, message: 'Logged out successfully' });
};

//Route for admin login
const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
			const token = jwt.sign(email + password, process.env.JWT_SECRET);
			res.json({ success: true, token });
		} else {
			res.json({ success: false, message: 'Invalid Credentials' });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export {
	registerUser,
	adminLogin,
	loginUser,
	refreshToken,
	logoutUser,
	verifyEmail,
	resendVerificationEmail,
	forgotPassword,
	resetPassword
};
