import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const Edit = ({ token }) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const productId = searchParams.get("id");

	const [image1, setImage1] = useState(false);
	const [image2, setImage2] = useState(false);
	const [image3, setImage3] = useState(false);
	const [image4, setImage4] = useState(false);

	const [existingImages, setExistingImages] = useState([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("Men");
	const [subCategory, setSubCategory] = useState("Topwear");
	const [bestseller, setBestseller] = useState(false);
	const [sizes, setSizes] = useState([]);
	const [stock, setStock] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchProduct = async () => {
		try {
			const response = await axios.post(BACKEND_URL + "/api/product/single", {
				productId,
			});
			if (response.data.success) {
				const p = response.data.product;
				setName(p.name);
				setDescription(p.description);
				setPrice(p.price);
				setCategory(p.category);
				setSubCategory(p.subCategory);
				setBestseller(p.bestseller);
				setSizes(p.sizes || []);
				setStock(p.stock ?? "");
				setExistingImages(p.image || []);
			} else {
				toast.error("Product not found");
				navigate("/list");
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (productId) {
			fetchProduct();
		} else {
			navigate("/list");
		}
	}, [productId, navigate]);

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append("id", productId);
			formData.append("name", name);
			formData.append("description", description);
			formData.append("price", price);
			formData.append("category", category);
			formData.append("subCategory", subCategory);
			formData.append("bestseller", bestseller);
			formData.append("sizes", JSON.stringify(sizes));
			formData.append("stock", stock);

			image1 && formData.append("image1", image1);
			image2 && formData.append("image2", image2);
			image3 && formData.append("image3", image3);
			image4 && formData.append("image4", image4);

			const response = await axios.post(
				BACKEND_URL + "/api/product/update",
				formData,
				{
					headers: { token },
				},
			);

			if (response.data.success) {
				toast.success(response.data.message);
				navigate("/list");
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const toggleSize = (size) => {
		setSizes((prev) =>
			prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
		);
	};

	if (loading) {
		return (
			<div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
				<Icon icon="solar:refresh-bold" className="animate-spin text-xl" />
				<p>Loading product...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
				Edit Product
			</h1>

			<form
				onSubmit={onSubmitHandler}
				className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-6"
			>
				{/* Images */}
				<div>
					<p className="mb-3 text-lg font-medium text-gray-800 dark:text-white">
						Product Images
					</p>
					{existingImages.length > 0 && (
						<div className="mb-3">
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
								Current images:
							</p>
							<div className="flex gap-2">
								{existingImages.map((img, i) => (
									<img
										key={i}
										src={img}
										className="w-20 rounded-lg border border-gray-200 dark:border-gray-700 object-cover opacity-50"
										alt=""
									/>
								))}
							</div>
						</div>
					)}
					<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
						New images (optional):
					</p>
					<div className="flex gap-2">
						{[1, 2, 3, 4].map((n) => {
							const imgState = [image1, image2, image3, image4][n - 1];
							const setImg = [setImage1, setImage2, setImage3, setImage4][
								n - 1
							];
							return (
								<label key={n} htmlFor={`image${n}`}>
									<img
										className="w-20 rounded-lg border border-gray-200 dark:border-gray-700 object-cover"
										src={
											!imgState
												? assets.upload_area
												: URL.createObjectURL(imgState)
										}
										alt=""
									/>
									<input
										onChange={(e) => setImg(e.target.files[0])}
										type="file"
										id={`image${n}`}
										hidden
									/>
								</label>
							);
						})}
					</div>
				</div>

				{/* Product Info */}
				<div>
					<p className="mb-3 text-lg font-medium text-gray-800 dark:text-white">
						Product Info
					</p>
					<div className="space-y-3 max-w-[500px]">
						<div>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
								Product name
							</p>
							<input
								onChange={(e) => setName(e.target.value)}
								value={name}
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
								type="text"
								placeholder="Type here"
								required
							/>
						</div>
						<div>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
								Product description
							</p>
							<textarea
								onChange={(e) => setDescription(e.target.value)}
								value={description}
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
								placeholder="Write content here"
								required
							/>
						</div>
					</div>
				</div>

				{/* Pricing & Stock */}
				<div>
					<p className="mb-3 text-lg font-medium text-gray-800 dark:text-white">
						Pricing & Stock
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<div>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
								Category
							</p>
							<select
								onChange={(e) => setCategory(e.target.value)}
								value={category}
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
							>
								<option value="Men">Men</option>
								<option value="Women">Women</option>
								<option value="Kids">Kids</option>
							</select>
						</div>
						<div>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
								Sub category
							</p>
							<select
								onChange={(e) => setSubCategory(e.target.value)}
								value={subCategory}
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
							>
								<option value="Topwear">Topwear</option>
								<option value="Bottomwear">Bottomwear</option>
								<option value="Winterwear">Winterwear</option>
							</select>
						</div>
						<div>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
								Price
							</p>
							<input
								onChange={(e) => setPrice(e.target.value)}
								value={price}
								type="number"
								className="w-full sm:w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
								placeholder="0"
							/>
						</div>
						<div>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
								Stock
							</p>
							<input
								onChange={(e) => setStock(e.target.value)}
								value={stock}
								type="number"
								className="w-full sm:w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
								placeholder="0"
								min="0"
							/>
						</div>
					</div>
				</div>

				{/* Sizes & Options */}
				<div>
					<p className="mb-3 text-lg font-medium text-gray-800 dark:text-white">
						Sizes & Options
					</p>
					<div className="flex flex-col gap-4">
						<div>
							<p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
								Product Sizes
							</p>
							<div className="flex gap-3">
								{SIZES.map((size) => (
									<div key={size} onClick={() => toggleSize(size)}>
										<p
											className={`${sizes.includes(size) ? "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"} rounded-lg px-3 py-1 cursor-pointer font-medium transition-colors`}
										>
											{size}
										</p>
									</div>
								))}
							</div>
						</div>
						<div className="flex items-center gap-2">
							<input
								onChange={() => setBestseller((prev) => !prev)}
								type="checkbox"
								id="bestseller"
								checked={bestseller}
								className="size-4 accent-gray-900"
							/>
							<label
								className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
								htmlFor="bestseller"
							>
								Add to bestseller
							</label>
						</div>
					</div>
				</div>

				<div className="flex gap-3">
					<button
						type="submit"
						className="flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-gray-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors cursor-pointer"
					>
						<Icon icon="solar:diskette-outline" className="text-lg" />
						UPDATE
					</button>
					<button
						type="button"
						onClick={() => navigate("/list")}
						className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
					>
						<Icon icon="solar:close-circle-outline" className="text-lg" />
						CANCEL
					</button>
				</div>
			</form>
		</div>
	);
};

export default Edit;
