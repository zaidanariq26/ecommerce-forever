import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	productId: { type: String, required: true },
	orderId: { type: String, required: true },
	rating: { type: Number, required: true, min: 1, max: 5 },
	comment: { type: String, required: true, trim: true },
	date: { type: Number, required: true, default: Date.now },
});

reviewSchema.index({ productId: 1, date: -1 });
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

const reviewModel =
	mongoose.model.review || mongoose.model("review", reviewSchema);

export default reviewModel;
