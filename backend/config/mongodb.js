import mongoose from 'mongoose';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retries = MAX_RETRIES) => {
	try {
		// Event listeners (register only once)
		if (mongoose.connection.listenerCount('connected') === 0) {
			mongoose.connection.on('connected', () => {
				console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
			});

			mongoose.connection.on('error', (err) => {
				console.error('❌ MongoDB Error:', err.message);
			});

			mongoose.connection.on('disconnected', () => {
				console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
			});
		}

		await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 5000, // fail fast if server unreachable
		});
	} catch (error) {
		console.error(`❌ Connection failed: ${error.message}`);

		if (retries > 0) {
			console.log(`🔄 Retrying... (${retries} attempts left)`);
			await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
			return connectDB(retries - 1);
		}

		console.error('💀 Could not connect to MongoDB. Exiting...');
		process.exit(1); // stop the app if DB is unreachable
	}
};

export default connectDB;
