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

	const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Coupons</h1>
				<span className="rounded-full bg-gray-200 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
					{coupons.length}
				</span>
			</div>

			{/* Create Coupon Card */}
			<div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
				<p className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Create Coupon</p>
				<form onSubmit={onSubmitHandler} className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="w-full sm:w-auto">
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Code</p>
							<input
								onChange={(e) => setCode(e.target.value)}
								value={code}
								type="text"
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 sm:w-[160px] dark:bg-gray-800 dark:text-gray-200"
								placeholder="e.g. SUMMER20"
								required
							/>
						</div>

						<div className="w-full sm:w-auto">
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Discount %</p>
							<input
								onChange={(e) => setDiscountPercent(e.target.value)}
								value={discountPercent}
								type="number"
								min="1"
								max="90"
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 sm:w-[100px] dark:bg-gray-800 dark:text-gray-200"
								placeholder="e.g. 20"
								required
							/>
						</div>

						<div className="w-full sm:w-auto">
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Min Order ($)</p>
							<input
								onChange={(e) => setMinOrder(e.target.value)}
								value={minOrder}
								type="number"
								min="0"
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 sm:w-[100px] dark:bg-gray-800 dark:text-gray-200"
								placeholder="0"
							/>
						</div>

						<div className="w-full sm:w-auto">
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Max Uses</p>
							<input
								onChange={(e) => setMaxUses(e.target.value)}
								value={maxUses}
								type="number"
								min="0"
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 sm:w-[100px] dark:bg-gray-800 dark:text-gray-200"
								placeholder="0 = unlimited"
							/>
						</div>

						<div className="w-full sm:w-auto">
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Expiry Date</p>
							<input
								onChange={(e) => setExpiry(e.target.value)}
								value={expiry}
								type="date"
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 sm:w-[160px] dark:bg-gray-800 dark:text-gray-200"
								required
							/>
						</div>
					</div>

					<button type="submit" className="flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-gray-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors cursor-pointer">
						<Icon icon="solar:add-circle-outline" className="text-lg" />
						CREATE
					</button>
				</form>
			</div>

			{/* Coupon List Card */}
			<div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
				{/* Desktop Header */}
				<div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm">
					<b className="text-gray-600 dark:text-gray-400 font-medium">Code</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Discount</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Min Order</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Max Uses</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Used</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Expiry</b>
					<b className="text-center text-gray-600 dark:text-gray-400 font-medium">Actions</b>
				</div>

				{/* Coupon Rows */}
				{coupons
					.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
					.map((coupon) => (
						<div
							key={coupon._id}
							className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center border-b border-gray-100 dark:border-gray-800 last:border-b-0 py-3 px-4 text-sm"
						>
							<p className="font-medium text-gray-800 dark:text-white">{coupon.code}</p>
							<p className="text-gray-700 dark:text-gray-300">{coupon.discountPercent}%</p>
							<p className="text-gray-700 dark:text-gray-300">
								{coupon.minOrder > 0
									? `${CURRENCY}${coupon.minOrder}`
									: "-"}
							</p>
							<p className="hidden md:block text-gray-700 dark:text-gray-300">{coupon.maxUses > 0 ? coupon.maxUses : "Unlimited"}</p>
							<p className="hidden md:block text-gray-700 dark:text-gray-300">{coupon.usedCount}</p>
							<p className={`hidden md:block ${isExpired(coupon.expiry) ? "text-red-500 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
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

				{/* Empty state */}
				{coupons.length === 0 && (
					<div className="py-12 text-center">
						<Icon icon="solar:ticket-outline" className="mx-auto mb-3 text-4xl text-gray-300 dark:text-gray-600" />
						<p className="text-sm text-gray-400 dark:text-gray-500">No coupons yet</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 flex-wrap">
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className="cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						Prev
					</button>
					<span className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">
						{currentPage} / {totalPages}
					</span>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm hidden sm:inline-block transition-colors ${
									currentPage === page
										? "bg-gray-900 text-white border-gray-900 dark:bg-gray-700 dark:border-gray-700"
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
								Math.min(totalPages, p + 1),
							)
						}
						disabled={currentPage === totalPages}
						className="cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default Coupons;
