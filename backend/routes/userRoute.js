import express from 'express';
import { adminLogin, loginUser, logoutUser, refreshToken, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/refresh-token', refreshToken);
userRouter.post('/logout', logoutUser);
userRouter.post('/admin', adminLogin);

export default userRouter;
