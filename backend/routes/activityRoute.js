import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import activityLogModel from '../models/activityLogModel.js';

const activityRouter = express.Router();

activityRouter.get('/list', adminAuth, async (req, res) => {
	try {
		const limit = Math.min(parseInt(req.query.limit) || 20, 100);
		const activities = await activityLogModel
			.find({})
			.sort({ timestamp: -1 })
			.limit(limit);
		res.json({ success: true, activities });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
});

export default activityRouter;
