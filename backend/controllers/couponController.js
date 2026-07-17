import couponModel from "../models/couponModel.js";

const createCoupon = async (req, res) => {
	try {
		const { code, discountPercent, minOrder, maxUses, expiry } = req.body;

		if (!code || !code.trim()) {
			return res.status(400).json({ success: false, message: "Coupon code is required" });
		}
		if (!discountPercent || discountPercent < 1 || discountPercent > 90) {
			return res.status(400).json({ success: false, message: "Discount must be between 1 and 90" });
		}
		if (!expiry) {
			return res.status(400).json({ success: false, message: "Expiry date is required" });
		}

		const existing = await couponModel.findOne({ code: code.trim().toUpperCase() });
		if (existing) {
			return res.status(400).json({ success: false, message: "Coupon code already exists" });
		}

		const coupon = new couponModel({
			code: code.trim().toUpperCase(),
			discountPercent,
			minOrder: minOrder || 0,
			maxUses: maxUses || 0,
			expiry: new Date(expiry).getTime(),
		});

		await coupon.save();
		res.json({ success: true, message: "Coupon created", coupon });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const listCoupons = async (req, res) => {
	try {
		const coupons = await couponModel.find({}).sort({ date: -1 });
		res.json({ success: true, coupons });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const deleteCoupon = async (req, res) => {
	try {
		const { id } = req.body;
		await couponModel.findByIdAndDelete(id);
		res.json({ success: true, message: "Coupon deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const validateCoupon = async (req, res) => {
	try {
		const { code, subtotal } = req.body;

		if (!code || !code.trim()) {
			return res.status(400).json({ success: false, message: "Coupon code is required" });
		}

		const coupon = await couponModel.findOne({ code: code.trim().toUpperCase() });
		if (!coupon) {
			return res.status(400).json({ success: false, message: "Invalid coupon code" });
		}

		if (!coupon.active) {
			return res.status(400).json({ success: false, message: "This coupon is no longer active" });
		}

		if (Date.now() > coupon.expiry) {
			return res.status(400).json({ success: false, message: "This coupon has expired" });
		}

		if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
			return res.status(400).json({ success: false, message: "This coupon has reached its usage limit" });
		}

		if (subtotal < coupon.minOrder) {
			return res.status(400).json({ success: false, message: `Minimum order of $${coupon.minOrder} required` });
		}

		const discount = (subtotal * coupon.discountPercent) / 100;

		res.json({
			success: true,
			coupon: {
				code: coupon.code,
				discountPercent: coupon.discountPercent,
				discount: Number(discount.toFixed(2)),
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const incrementCouponUsage = async (code) => {
	await couponModel.findOneAndUpdate({ code: code.toUpperCase() }, { $inc: { usedCount: 1 } });
};

export { createCoupon, listCoupons, deleteCoupon, validateCoupon, incrementCouponUsage };
