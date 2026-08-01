import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../../models/productModel.js';

dotenv.config();

const FILL_STOCK = 100;

const fillStock = async () => {
	const startTime = Date.now();

	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('✅ MongoDB Connected');

		const result = await Product.updateMany(
			{},
			{ $set: { stock: FILL_STOCK } },
		);

		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);

		console.log(`✅ ${result.modifiedCount} products updated to stock: ${FILL_STOCK}`);
		console.log(`⏱️  Total time: ${duration} seconds`);

		process.exit(0);
	} catch (error) {
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);
		console.error('❌ Stock fill failed:', error.message);
		console.log(`⏱️  Failed after: ${duration} seconds`);
		process.exit(1);
	}
};

fillStock();
