import userModel from '../models/userModel.js';

// Get user's wishlist
const getWishlist = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await userModel.findById(userId);
		res.json({ success: true, wishlist: user.wishlist || [] });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Toggle wishlist item (add if not present, remove if present)
const toggleWishlist = async (req, res) => {
	try {
		const { productId } = req.body;
		const userId = req.user.id;

		if (!productId) {
			return res.status(400).json({ success: false, message: 'Product ID is required' });
		}

		const user = await userModel.findById(userId);
		const wishlist = user.wishlist || [];

		const index = wishlist.indexOf(productId);
		if (index > -1) {
			wishlist.splice(index, 1);
		} else {
			wishlist.push(productId);
		}

		await userModel.findByIdAndUpdate(userId, { wishlist });
		res.json({ success: true, wishlist, message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Check if products are in wishlist
const checkWishlist = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await userModel.findById(userId);
		const wishlist = user.wishlist || [];

		const { productIds } = req.body;
		const map = {};
		productIds.forEach((id) => {
			map[id] = wishlist.includes(id);
		});

		res.json({ success: true, map });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export { getWishlist, toggleWishlist, checkWishlist };
