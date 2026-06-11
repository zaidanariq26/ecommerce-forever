// backend/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import Product from '../models/productModel.js';
import { products } from '../assets/assets.js';
import connectCloudinary from '../config/cloudinary.js';

dotenv.config();
connectCloudinary();

const seedDB = async () => {
	const startTime = Date.now(); // ← start timer here

	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('✅ MongoDB Connected');

		await Product.deleteMany({});
		console.log('🗑️ Old products cleared');

		const seededProducts = [];

		for (const product of products) {
			const { _id, image, ...rest } = product;
			console.log(`📤 Uploading images for: ${product.name}`);

			const uploadedImages = await Promise.all(
				image.map(async (localPath) => {
					const result = await cloudinary.uploader.upload(localPath, {
						folder: 'e-commerce/products',
					});
					return result.secure_url;
				}),
			);

			seededProducts.push({ ...rest, image: uploadedImages });
		}

		await Product.insertMany(seededProducts);

		const endTime = Date.now(); // ← stop timer here
		const duration = ((endTime - startTime) / 1000).toFixed(2); // convert to seconds

		console.log(`✅ ${seededProducts.length} products inserted with Cloudinary images`);
		console.log(`⏱️  Total time: ${duration} seconds`); // ← print the result

		process.exit(0);
	} catch (error) {
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);
		console.error('❌ Seeding failed:', error.message);
		console.log(`⏱️  Failed after: ${duration} seconds`);
		process.exit(1);
	}
};

seedDB();
