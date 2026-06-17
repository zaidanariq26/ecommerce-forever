import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../../models/userModel.js';

dotenv.config();

const cleanUpUsers = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('MongoDB connected');

		// Delete all the past users
		await userModel.deleteMany({});
		console.log('Users cleared');
	} catch (error) {
		console.error('Cleared error:', error);
	} finally {
		await mongoose.disconnect();
		console.log('MongoDB disconnected');
	}
};

cleanUpUsers();
