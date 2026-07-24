import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
	try {
		const { token } = req.headers;
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Not Authorized, Login Again" });
		}

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		if (decoded.role !== "admin") {
			return res
				.status(403)
				.json({ success: false, message: "Not authorized as admin" });
		}

		req.user = decoded;
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Invalid or expired token" });
	}
};

export default adminAuth;
