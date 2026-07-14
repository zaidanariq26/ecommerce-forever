import express from 'express';
import { addReview, getReviews, getReviewable, deleteReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.post('/list', getReviews);
reviewRouter.post('/reviewable', authUser, getReviewable);
reviewRouter.post('/delete', authUser, deleteReview);

export default reviewRouter;
