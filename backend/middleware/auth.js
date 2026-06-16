import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
	try {
		// Get a token from Authorization header
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ success: false, message: 'No token provided' });
		}

		const token = authHeader.split(' ')[1];

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = decoded;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: 'Invalid or expired token' });
	}
};

export default authUser;
