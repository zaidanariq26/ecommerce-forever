import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import logActivity from "../utils/activityLogger.js";

// function for add product
const addProduct = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			category,
			subCategory,
			sizes,
			bestseller,
			stock,
		} = req.body;

		const image1 = req.files.image1 && req.files.image1[0];
		const image2 = req.files.image2 && req.files.image2[0];
		const image3 = req.files.image3 && req.files.image3[0];
		const image4 = req.files.image4 && req.files.image4[0];

		const images = [image1, image2, image3, image4].filter(
			(item) => item !== undefined,
		);

		let imagesUrl = await Promise.all(
			images.map(async (item) => {
				let result = await cloudinary.uploader.upload(item.path, {
					resource_type: "image",
				});
				return result.secure_url;
			}),
		);

		let parsedSizes;
		try {
			parsedSizes = JSON.parse(sizes);
		} catch {
			return res
				.status(400)
				.json({ success: false, message: "Invalid sizes JSON" });
		}

		const productData = {
			name,
			description,
			category,
			price: Number(price),
			subCategory,
			bestseller: bestseller === "true" ? true : false,
			sizes: parsedSizes,
			image: imagesUrl,
			date: Date.now(),
			stock: Number(stock) || 0,
		};

		const product = new productModel(productData);
		await product.save();

		await logActivity("Product Added", "Product", product._id, name);
		res.json({ success: true, message: "Product Added" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// function for list product
const listProducts = async (req, res) => {
	try {
		const products = await productModel.find({});
		res.json({ success: true, products });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// function for remove product
const removeProduct = async (req, res) => {
	try {
		const product = await productModel.findById(req.body.id);
		if (!product) {
			return res.status(404).json({ success: false, message: "Product not found" });
		}
		await productModel.findByIdAndDelete(req.body.id);
		await logActivity("Product Removed", "Product", req.body.id, product.name);
		res.json({ success: true, message: "Product Removed" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// function for single product info
const singleProduct = async (req, res) => {
	try {
		const { productId } = req.body;
		const product = await productModel.findById(productId);
		res.json({ success: true, product });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// function for update product
const updateProduct = async (req, res) => {
	try {
		const {
			id,
			name,
			description,
			price,
			category,
			subCategory,
			sizes,
			bestseller,
			stock,
		} = req.body;

		const updateData = {
			name,
			description,
			price: Number(price),
			category,
			subCategory,
			bestseller: bestseller === "true" ? true : false,
			stock: Number(stock) || 0,
		};

		let parsedSizes;
		try {
			parsedSizes = JSON.parse(sizes);
		} catch {
			return res
				.status(400)
				.json({ success: false, message: "Invalid sizes JSON" });
		}
		updateData.sizes = parsedSizes;

		const images = [
			req.files.image1 && req.files.image1[0],
			req.files.image2 && req.files.image2[0],
			req.files.image3 && req.files.image3[0],
			req.files.image4 && req.files.image4[0],
		].filter((item) => item !== undefined);

		if (images.length > 0) {
			let imagesUrl = await Promise.all(
				images.map(async (item) => {
					let result = await cloudinary.uploader.upload(item.path, {
						resource_type: "image",
					});
					return result.secure_url;
				}),
			);
			updateData.image = imagesUrl;
		}

		await productModel.findByIdAndUpdate(id, updateData);
		res.json({ success: true, message: "Product Updated" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// function for inline stock update
const updateStock = async (req, res) => {
	try {
		const { id, stock } = req.body;

		if (stock < 0) {
			return res.status(400).json({ success: false, message: "Stock cannot be negative" });
		}

		await productModel.findByIdAndUpdate(id, { stock: Number(stock) });
		await logActivity("Stock Updated", "Product", id, `Stock: ${stock}`);
		res.json({ success: true, message: "Stock Updated" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export {
	addProduct,
	listProducts,
	removeProduct,
	singleProduct,
	updateProduct,
	updateStock,
};
