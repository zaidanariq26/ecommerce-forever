import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../../models/productModel.js';
import connectCloudinary from '../../config/cloudinary.js';

dotenv.config();
connectCloudinary();

const cleanup = async () => {
	try {
		// ── 1. Connect to MongoDB ──────────────────────────────
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('✅ MongoDB Connected');

		// ── 2. Delete Cloudinary folder ────────────────────────
		console.log('🗑️  Deleting images from Cloudinary...');
		const cloudinaryResult = await cloudinary.api.delete_resources_by_prefix('e-commerce/products');
		const deletedCount = Object.keys(cloudinaryResult.deleted).length;
		console.log(`✅ Deleted ${deletedCount} images from Cloudinary`);

		// Also remove the empty folder
		await cloudinary.api.delete_folder('e-commerce/products');
		console.log('✅ Cloudinary folder removed');

		// ── 3. Delete all products from MongoDB ────────────────
		console.log('🗑️  Deleting all products from MongoDB...');
		const { deletedCount: mongoDeleted } = await Product.deleteMany({});
		console.log(`✅ Deleted ${mongoDeleted} products from MongoDB`);

		console.log('\n🎉 Cleanup complete! Both MongoDB and Cloudinary are now empty.');
		process.exit(0);
	} catch (error) {
		console.error('❌ Cleanup failed:', error.message);
		process.exit(1);
	}
};

cleanup();
