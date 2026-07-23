import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
	sendResetPasswordEmail,
	sendVerificationEmail,
} from "../services/emailService.js";
import { addToBlocklist, isBlocked } from "../middleware/tokenBlocklist.js";
import { Country, State, City } from "country-state-city";

const createAccessToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: "15m",
	});
};

const createRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "7d",
	});
};

const validateAddress = (address) => {
	const errors = [];

	if (!address || typeof address !== "object") {
		return { valid: false, errors: ["Address is required"] };
	}

	const { country, state, city, zipcode } = address;

	if (!country || !country.trim()) {
		errors.push("Country is required");
	} else {
		const found = Country.getAllCountries().find(
			(c) => c.name.toLowerCase() === country.trim().toLowerCase(),
		);
		if (!found) {
			errors.push("Invalid country");
		} else {
			if (!state || !state.trim()) {
				errors.push("State is required");
			} else {
				const states = State.getStatesOfCountry(found.isoCode);
				const stateFound = states.find(
					(s) => s.name.toLowerCase() === state.trim().toLowerCase(),
				);
				if (!stateFound) {
					errors.push("Invalid state for the selected country");
				} else if (!city || !city.trim()) {
					errors.push("City is required");
				} else {
					const cities = City.getCitiesOfState(
						found.isoCode,
						stateFound.isoCode,
					);
					const cityFound = cities.find(
						(c) => c.name.toLowerCase() === city.trim().toLowerCase(),
					);
					if (!cityFound) {
						errors.push("Invalid city for the selected state");
					}
				}
			}
		}
	}

	if (!zipcode || !zipcode.trim()) {
		errors.push("Zipcode is required");
	} else if (!/^[a-zA-Z0-9\s\-]{1,10}$/.test(zipcode.trim())) {
		errors.push("Invalid zipcode format");
	}

	return { valid: errors.length === 0, errors };
};

const refreshToken = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "No refresh token" });
		}

		if (isBlocked(token)) {
			return res
				.status(401)
				.json({ success: false, message: "Token has been revoked" });
		}

		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		const user = await userModel.findById(decoded.id);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "User not found" });
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
				role: user.role,
			},
		});
	} catch (error) {
		console.log(error.message);
		res.status(401).json({ success: false, message: "Invalid refresh token" });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Input validation
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required" });
		}

		if (!validator.isEmail(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email format" });
		}

		// User check
		const user = await userModel.findOne({ email }).select("+password");
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// Password check
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// Check user verified
		if (!user.isVerified) {
			return res
				.status(403)
				.json({
					success: false,
					message: "Please verify your email first",
					errorType: "EMAIL_NOT_VERIFIED",
				});
		}

		// Generate tokens
		const accessToken = createAccessToken(user._id, user.role);
		const refreshToken = createRefreshToken(user._id);

		// Save refresh token at httpOnly cookie
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
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
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		// Validate input
		if (!firstName || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		if (!validator.isEmail(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email format" });
		}

		if (password.length < 8) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Password must be at least 8 characters",
				});
		}

		// Check email that is already registered
		const user = await userModel.findOne({ email: email.toLowerCase().trim() });

		if (user) {
			if (user.isVerified) {
				return res.status(409).json({
					success: false,
					message: "Email already registered",
				});
			}

			// Jika belum verified
			return res.status(403).json({
				success: false,
				message: "This email is registered but not verified yet",
				errorType: "EMAIL_NOT_VERIFIED",
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate verification token
		const verifyToken = crypto.randomBytes(32).toString("hex");
		const verifyTokenExpiry = Date.now() + 15 * 60 * 1000;

		// Save user data
		const newUser = await userModel.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			isVerified: false,
			verifyToken,
			verifyTokenExpiry,
		});

		try {
			await sendVerificationEmail(email, verifyToken);
		} catch (emailError) {
			console.error("Failed to send reset verification email:", emailError);

			newUser.verifyToken = undefined;
			newUser.verifyTokenExpiry = undefined;
			await newUser.save();

			return res.status(502).json({
				success: false,
				message:
					"We couldn't send the verification email right now. Please try again in a moment.",
			});
		}

		res.status(201).json({
			success: true,
			message:
				"Registration successful, please check your email to verify your account",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;

		const user = await userModel
			.findOne({
				verifyToken: token,
				verifyTokenExpiry: { $gt: Date.now() },
			})
			.select("+verifyToken +verifyTokenExpiry");

		if (!user) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Invalid or expired verification link",
				});
		}

		// Update user
		user.isVerified = true;
		user.verifyToken = undefined;
		user.verifyTokenExpiry = undefined;
		await user.save();

		// Auto-login — generate tokens
		const accessToken = createAccessToken(user._id, user.role);
		const refreshToken = createRefreshToken(user._id);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			success: true,
			accessToken,
			message: "Email verified successfully",
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const resendVerificationEmail = async (req, res) => {
	try {
		const { token, email } = req.body;

		if (!token && !email) {
			return res.status(400).json({
				success: false,
				message: "Please provide either a token or an email address.",
			});
		}

		const query = {};
		if (token) query.verifyToken = token;
		if (email) query.email = email;

		const user = await userModel
			.findOne(query)
			.select("+verifyToken +verifyTokenExpiry");

		if (!user) {
			return res.status(400).json({
				success: false,
				message:
					"Account not found or the link is invalid. Please double-check!",
			});
		}

		if (user.isVerified) {
			return res.status(400).json({
				success: false,
				message: "Email already verified",
			});
		}

		// Generate new token
		user.verifyToken = crypto.randomBytes(32).toString("hex");
		user.verifyTokenExpiry = Date.now() + 15 * 60 * 1000;
		await user.save();

		// Send verification email
		try {
			await sendVerificationEmail(user.email, user.verifyToken);
		} catch (emailError) {
			console.error("Failed to send verification email:", emailError);

			user.verifyToken = undefined;
			user.verifyTokenExpiry = undefined;
			await user.save();

			return res.status(502).json({
				success: false,
				message:
					"We couldn't send the verification email right now. Please try again in a moment.",
			});
		}

		res.status(200).json({
			success: true,
			message: "Verification email has been resent, please check your email",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "Please enter a valid email",
			});
		}

		const user = await userModel
			.findOne({ email })
			.select("+resetPasswordToken +resetPasswordTokenExpiry");

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Email is not available",
			});
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = Date.now() + 5 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordTokenExpiry = resetTokenExpiry;
		await user.save();

		try {
			await sendResetPasswordEmail(user.email, resetToken);
		} catch (emailError) {
			console.error("Failed to send reset password email:", emailError);

			user.resetPasswordToken = undefined;
			user.resetPasswordTokenExpiry = undefined;
			await user.save();

			return res.status(502).json({
				success: false,
				message:
					"We couldn't send the reset email right now. Please try again in a moment.",
			});
		}

		res.status(200).json({
			success: true,
			message: "Reset link has been sent successfully",
		});
	} catch (error) {
		console.error("forgotPassword error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
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
				message: "Reset token is required",
			});
		}

		if (!password || !passwordConfirmation) {
			return res.status(400).json({
				success: false,
				message: "Password and confirmation are required",
			});
		}

		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 8 characters",
			});
		}

		if (password !== passwordConfirmation) {
			return res.status(400).json({
				success: false,
				message: "Passwords do not match",
			});
		}

		// Check if user is available
		const user = await userModel
			.findOne({
				resetPasswordToken: token,
				resetPasswordTokenExpiry: { $gt: Date.now() },
			})
			.select("+resetPasswordToken +resetPasswordTokenExpiry");

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired reset link",
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
			message:
				"Password reset successfully, please login with your new password",
		});
	} catch (error) {
		console.error("resetPassword error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const logoutUser = (req, res) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ success: false, message: "Not authenticated" });
	}

	const refreshToken = req.cookies.refreshToken;
	if (refreshToken) {
		addToBlocklist(refreshToken);
	}

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

const getProfile = async (req, res) => {
	try {
		const user = await userModel.findById(req.user.id);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone || "",
				address: user.address || {},
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, phone, address } = req.body;
		const userId = req.user.id;

		const user = await userModel.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Validate required fields
		const errors = [];
		if (!firstName || !firstName.trim()) errors.push("First name is required");
		if (!phone || !phone.trim()) errors.push("Phone number is required");
		else if (!/^[0-9]{7,15}$/.test(phone.trim()))
			errors.push("Invalid phone number format");

		if (errors.length > 0) {
			return res
				.status(400)
				.json({ success: false, message: errors.join(", ") });
		}

		// Validate address
		const { valid, errors: addressErrors } = validateAddress(address);
		if (!valid) {
			return res
				.status(400)
				.json({ success: false, message: addressErrors.join(", ") });
		}

		user.firstName = firstName.trim();
		user.lastName = lastName ? lastName.trim() : "";
		user.phone = phone.trim();
		user.address = address;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone || "",
				address: user.address || {},
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

//Route for admin login
const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required" });
		}

		const user = await userModel.findOne({ email }).select("+password");
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		if (user.role !== "admin") {
			return res
				.status(403)
				.json({ success: false, message: "Not authorized as admin" });
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_ACCESS_SECRET,
			{
				expiresIn: "24h",
			},
		);

		res.status(200).json({ success: true, token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}};

export {
	registerUser,
	adminLogin,
	loginUser,
	refreshToken,
	logoutUser,
	verifyEmail,
	resendVerificationEmail,
	forgotPassword,
	resetPassword,
	getProfile,
	updateProfile,
};
