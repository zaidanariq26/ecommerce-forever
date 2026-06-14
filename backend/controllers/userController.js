import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const loginUser = async (req, res) => {
	console.log(req.email);
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
		res.status(200).json({ success: true, accessToken });
	} catch (error) {
		res.status(401).json({ success: false, message: 'Invalid refresh token' });
	}
};

const logoutUser = (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict'
	});
	res.status(200).json({ success: true, message: 'Logged out successfully' });
};

//Route for user register
const registerUser = async (req, res) => {
	try {
		const { email, name, password } = req.body;

		//checking user already exists
		const exists = await userModel.findOne({ email });
		if (exists) {
			return res.json({ success: false, message: 'User already exists' });
		}

		//validating email format & strong password
		if (!validator.isEmail(email)) {
			return res.json({ success: false, message: 'Please enter a valid email' });
		}
		if (password.length < 8) {
			return res.json({ success: false, message: 'Please enter a strong password' });
		}

		//hashing user password
		const salt = await bycrpt.genSalt(10);
		const hashedPassword = await bycrpt.hash(password, salt);

		const newUser = new userModel({
			name,
			email,
			password: hashedPassword
		});

		const user = await newUser.save();

		const token = createToken(user._id);

		res.json({ success: 'true', token });
	} catch (error) {
		console.log(error);
		res.json({ success: 'false', message: error.message });
	}
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

export { registerUser, adminLogin, loginUser, refreshToken, logoutUser };
