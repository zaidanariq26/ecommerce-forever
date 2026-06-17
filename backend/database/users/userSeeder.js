import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userModel from '../../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const users = [
	{
		firstName: 'Admin',
		lastName: 'Super',
		email: 'admin@gmail.com',
		password: 'password',
		phone: '081234567890',
		role: 'admin',
		isVerified: true,
		address: {
			street: 'Jl. Sudirman No. 1',
			city: 'Jakarta',
			state: 'DKI Jakarta',
			country: 'Indonesia',
			zipcode: '10220'
		}
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		password: 'password',
		phone: '082345678901',
		role: 'user',
		isVerified: true,
		address: {
			street: 'Jl. Gatot Subroto No. 10',
			city: 'Bandung',
			state: 'Jawa Barat',
			country: 'Indonesia',
			zipcode: '40111'
		}
	},
	{
		firstName: 'Jane',
		lastName: 'Doe',
		email: 'jane@example.com',
		password: 'user123456',
		phone: '083456789012',
		role: 'user',
		isVerified: false,
		address: {
			street: 'Jl. Imam Bonjol No. 5',
			city: 'Surabaya',
			state: 'Jawa Timur',
			country: 'Indonesia',
			zipcode: '60241'
		}
	}
];

const seedUsers = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('MongoDB connected');

		// Delete all the past users
		await userModel.deleteMany({});
		console.log('Users cleared');

		// Hash password
		const hashedUsers = await Promise.all(
			users.map(async (user) => ({
				...user,
				password: await bcrypt.hash(user.password, 10)
			}))
		);

		await userModel.insertMany(hashedUsers);
		console.log('Users seeded successfully');
	} catch (error) {
		console.error('Seeder error:', error);
	} finally {
		await mongoose.disconnect();
		console.log('MongoDB disconnected');
	}
};

seedUsers();
