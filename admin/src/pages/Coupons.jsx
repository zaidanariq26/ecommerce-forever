import { useEffect, useState } from "react";
import { BACKEND_URL, CURRENCY } from "../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const ITEMS_PER_PAGE = 10;

const Coupons = ({ token }) => {
	const [coupons, setCoupons] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [code, setCode] = useState("");
	const [discountPercent, setDiscountPercent] = useState("");
	const [minOrder, setMinOrder] = useState("");
	const [maxUses, setMaxUses] = useState("");
	const [expiry, setExpiry] = useState("");

	const fetchCoupons = async () => {
		try {
			const response = await axios.get(BACKEND_URL + "/api/coupon/list", {
				headers: { token },
			});
			if (response.data.success) {
				setCoupons(response.data.coupons);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				BACKEND_URL + "/api/coupon/create",
				{ code, discountPercent: Number(discountPercent), minOrder: Number(minOrder) || 0, maxUses: Number(maxUses) || 0, expiry },
				{ headers: { token } },
			);

			if (response.data.success) {
				toast.success(response.data.message);
				setCode("");
				setDiscountPercent("");
				setMinOrder("");
				setMaxUses("");
				setExpiry("");
				await fetchCoupons();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || error.message);
		}
	};

	const removeCoupon = async (id) => {
		if (!window.confirm("Are you sure you want to delete this coupon?")) return;

		try {
			const response = await axios.post(
				BACKEND_URL + "/api/coupon/remove",
				{ id },
				{ headers: { token } },
			);

			if (response.data.success) {
				toast.success(response.data.message);
				await fetchCoupons();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchCoupons();
	}, []);

	const isExpired = (expiryTimestamp) => Date.now() > expiryTimestamp;

	const formatDate = (timestamp) => {
		return new Date(timestamp).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div>
			<form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3 mb-8">
				<p className="mb-2 text-gray-700 dark:text-gray-300">Add Coupon</p>

				<div className="flex flex-col sm:flex-row gap-3 w-full sm:gap-8">
					<div className="w-full sm:w-auto">
						<p className="mb-1 text-sm">Code</p>
						<input
							onChange={(e) => setCode(e.target.value)}
							value={code}
							type="text"
							className="w-full px-3 py-2 sm:w-[160px] dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
							placeholder="e.g. SUMMER20"
							required
						/>
					</div>

					<div className="w-full sm:w-auto">
						<p className="mb-1 text-sm">Discount %</p>
						<input
							onChange={(e) => setDiscountPercent(e.target.value)}
							value={discountPercent}
							type="number"
							min="1"
							max="90"
							className="w-full px-3 py-2 sm:w-[100px] dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
							placeholder="e.g. 20"
							required
						/>
					</div>

					<div className="w-full sm:w-auto">
						<p className="mb-1 text-sm">Min Order ($)</p>
						<input
							onChange={(e) => setMinOrder(e.target.value)}
							value={minOrder}
							type="number"
							min="0"
							className="w-full px-3 py-2 sm:w-[100px] dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
							placeholder="0"
						/>
					</div>

					<div className="w-full sm:w-auto">
						<p className="mb-1 text-sm">Max Uses</p>
						<input
							onChange={(e) => setMaxUses(e.target.value)}
							value={maxUses}
							type="number"
							min="0"
							className="w-full px-3 py-2 sm:w-[100px] dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
							placeholder="0 = unlimited"
						/>
					</div>

					<div className="w-full sm:w-auto">
						<p className="mb-1 text-sm">Expiry Date</p>
						<input
							onChange={(e) => setExpiry(e.target.value)}
							value={expiry}
							type="date"
							className="w-full px-3 py-2 sm:w-[160px] dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
							required
						/>
					</div>
				</div>

				<button type="submit" className="w-28 py-3 mt-2 bg-gray-900 text-white cursor-pointer">
					ADD
				</button>
			</form>

			<p className="mb-2 text-gray-700 dark:text-gray-300">All Coupons</p>
			<div className="flex flex-col gap-2">
				<div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 dark:bg-gray-800 text-sm">
					<b>Code</b>
					<b>Discount</b>
					<b>Min Order</b>
					<b>Max Uses</b>
					<b>Used</b>
					<b>Expiry</b>
					<b className="text-center">Actions</b>
				</div>

				{coupons
					.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
					.map((coupon) => (
						<div
							key={coupon._id}
							className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border dark:border-gray-700 text-sm"
						>
							<p className="font-medium text-gray-800 dark:text-white">{coupon.code}</p>
							<p className="text-gray-700 dark:text-gray-300">{coupon.discountPercent}%</p>
							<p className="text-gray-700 dark:text-gray-300">
								{coupon.minOrder > 0
									? `${CURRENCY}${coupon.minOrder}`
									: "-"}
							</p>
							<p className="text-gray-700 dark:text-gray-300">{coupon.maxUses > 0 ? coupon.maxUses : "Unlimited"}</p>
							<p className="text-gray-700 dark:text-gray-300">{coupon.usedCount}</p>
							<p className={isExpired(coupon.expiry) ? "text-red-500 dark:text-red-400" : ""}>
								{formatDate(coupon.expiry)}
								{isExpired(coupon.expiry) && " (Expired)"}
							</p>
						<div className="flex items-center justify-end md:justify-center">
							<button
								onClick={() => removeCoupon(coupon._id)}
								aria-label="Delete coupon"
								className="cursor-pointer rounded-lg p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
							>
								<Icon icon="solar:trash-bin-trash-outline" className="text-lg" />
							</button>
						</div>
						</div>
					))}
			</div>

			{coupons.length > ITEMS_PER_PAGE && (
				<div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className="cursor-pointer border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
					>
						Prev
					</button>
					<span className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">
						{currentPage} / {Math.ceil(coupons.length / ITEMS_PER_PAGE)}
					</span>
					{Array.from({ length: Math.ceil(coupons.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(
						(page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`cursor-pointer border px-3 py-1 text-sm hidden sm:inline-block ${
									currentPage === page
										? "bg-gray-900 text-white border-gray-900 dark:border-gray-100"
										: "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
								}`}
							>
								{page}
							</button>
						),
					)}
					<button
						onClick={() =>
							setCurrentPage((p) =>
								Math.min(Math.ceil(coupons.length / ITEMS_PER_PAGE), p + 1),
							)
						}
						disabled={currentPage === Math.ceil(coupons.length / ITEMS_PER_PAGE)}
						className="cursor-pointer border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default Coupons;
