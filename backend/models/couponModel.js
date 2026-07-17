import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
	code: { type: String, required: true, unique: true, uppercase: true, trim: true },
	discountPercent: { type: Number, required: true, min: 1, max: 90 },
	minOrder: { type: Number, required: true, default: 0 },
	maxUses: { type: Number, required: true, default: 0 },
	usedCount: { type: Number, required: true, default: 0 },
	expiry: { type: Number, required: true },
	active: { type: Boolean, required: true, default: true },
	date: { type: Number, required: true, default: Date.now },
});

const couponModel = mongoose.model.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;
