import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50
		},
		lastName: {
			type: String,
			trim: true,
			maxlength: 50
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			maxlength: 100
		},
		password: {
			type: String,
			required: true,
			minlength: 8
		},
		phone: {
			type: String,
			trim: true,
			maxlength: 20
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		address: {
			street: { type: String, trim: true, maxlength: 100 },
			city: { type: String, trim: true, maxlength: 50 },
			state: { type: String, trim: true, maxlength: 50 },
			country: { type: String, trim: true, maxlength: 50 },
			zipcode: { type: String, trim: true, maxlength: 10 }
		},
		cartData: {
			type: Object,
			default: {}
		},
		verifyToken: { type: String },
		verifyTokenExpiry: { type: Date },
		resetPasswordToken: { type: String },
		resetPasswordTokenExpiry: { type: Date }
	},
	{
		minimize: false,
		timestamps: true // add createdAt and updatedAt automatically
	}
);

const userModel = mongoose.models.user || mongoose.model('users', userSchema);

export default userModel;
