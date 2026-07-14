import express from 'express';
import { getWishlist, toggleWishlist, checkWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/auth.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/get', authUser, getWishlist);
wishlistRouter.post('/toggle', authUser, toggleWishlist);
wishlistRouter.post('/check', authUser, checkWishlist);

export default wishlistRouter;
