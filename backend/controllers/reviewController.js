import reviewModel from '../models/reviewModel.js';
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';

const updateProductRating = async (productId) => {
	const result = await reviewModel.aggregate([
		{ $match: { productId } },
		{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
	]);

	if (result.length > 0) {
		await productModel.findByIdAndUpdate(productId, {
			rating: Math.round(result[0].avg * 10) / 10,
			numReviews: result[0].count,
		});
	} else {
		await productModel.findByIdAndUpdate(productId, {
			rating: 0,
			numReviews: 0,
		});
	}
};

// Add a review (only for delivered orders)
const addReview = async (req, res) => {
	try {
		const { productId, orderId, rating, comment } = req.body;
		const userId = req.user.id;

		if (!productId || !orderId || !rating || !comment) {
			return res.status(400).json({ success: false, message: 'All fields are required' });
		}

		const numericRating = Number(rating);
		if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
			return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
		}

		// Verify order exists and belongs to user
		const order = await orderModel.findById(orderId);
		if (!order) {
			return res.status(404).json({ success: false, message: 'Order not found' });
		}
		if (order.userId !== userId) {
			return res.status(403).json({ success: false, message: 'Not authorized' });
		}

		// Verify product is in the order
		const itemInOrder = order.items.find((item) => item._id === productId);
		if (!itemInOrder) {
			return res.status(400).json({ success: false, message: 'Product not found in this order' });
		}

		// Verify order is delivered
		if (order.status !== 'Delivered') {
			return res.status(400).json({ success: false, message: 'Reviews can only be added for delivered orders' });
		}

		// Upsert: update existing review or create new one
		const existing = await reviewModel.findOne({ userId, productId, orderId });
		if (existing) {
			existing.rating = numericRating;
			existing.comment = comment;
			existing.date = Date.now();
			await existing.save();
			await updateProductRating(productId);
			return res.json({ success: true, message: 'Review updated' });
		}

		const review = new reviewModel({
			userId,
			productId,
			orderId,
			rating: numericRating,
			comment,
			date: Date.now(),
		});
		await review.save();
		await updateProductRating(productId);

		res.json({ success: true, message: 'Review added' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get reviewable items for an order
const getReviewable = async (req, res) => {
	try {
		const { orderId } = req.body;
		const userId = req.user.id;

		const order = await orderModel.findById(orderId);
		if (!order) {
			return res.status(404).json({ success: false, message: 'Order not found' });
		}
		if (order.userId !== userId) {
			return res.status(403).json({ success: false, message: 'Not authorized' });
		}

		const productIds = order.items.map((item) => item._id);
		const reviews = await reviewModel.find({
			userId,
			orderId,
			productId: { $in: productIds },
		});

		const reviewedMap = {};
		reviews.forEach((r) => {
			reviewedMap[r.productId] = {
				rating: r.rating,
				comment: r.comment,
			};
		});

		const items = order.items.map((item) => ({
			productId: item._id,
			name: item.name,
			reviewed: !!reviewedMap[item._id],
			review: reviewedMap[item._id] || null,
		}));

		res.json({ success: true, items });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get all reviews for a product
const getReviews = async (req, res) => {
	try {
		const { productId } = req.body;

		const reviews = await reviewModel.find({ productId }).sort({ date: -1 });
		const total = reviews.length;
		const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

		res.json({ success: true, reviews, averageRating: Math.round(avg * 10) / 10, total });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Delete own review
const deleteReview = async (req, res) => {
	try {
		const { reviewId } = req.body;
		const userId = req.user.id;

		const review = await reviewModel.findById(reviewId);
		if (!review) {
			return res.status(404).json({ success: false, message: 'Review not found' });
		}

		if (review.userId !== userId) {
			return res.status(403).json({ success: false, message: 'Not authorized' });
		}

		const productId = review.productId;
		await reviewModel.findByIdAndDelete(reviewId);
		await updateProductRating(productId);

		res.json({ success: true, message: 'Review deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export { addReview, getReviews, getReviewable, deleteReview };
