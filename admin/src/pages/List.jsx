import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CURRENCY } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const ITEMS_PER_PAGE = 10;

const List = ({ token }) => {
	const [list, setList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingStock, setEditingStock] = useState(null);
	const [stockValue, setStockValue] = useState('');
	const navigate = useNavigate();

	const fetchList = async () => {
		try {
			const response = await axios.get(BACKEND_URL + '/api/product/list');
			if (response.data.success) {
				setList(response.data.products);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const removeProduct = async (id) => {
		if (!window.confirm('Are you sure you want to delete this product?')) return;

		try {
			const response = await axios.post(BACKEND_URL + '/api/product/remove', { id }, { headers: { token } });

			if (response.data.success) {
				toast.success(response.data.message);
				await fetchList();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const saveStock = async (productId) => {
		const newStock = parseInt(stockValue, 10);
		if (isNaN(newStock) || newStock < 0) {
			toast.error('Stock must be a non-negative number');
			setEditingStock(null);
			return;
		}

		const product = list.find((p) => p._id === productId);
		if (product && product.stock === newStock) {
			setEditingStock(null);
			return;
		}

		try {
			const response = await axios.post(
				BACKEND_URL + '/api/product/stock',
				{ id: productId, stock: newStock },
				{ headers: { token } },
			);
			if (response.data.success) {
				setList((prev) =>
					prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p)),
				);
				toast.success('Stock updated');
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
		setEditingStock(null);
	};

	const startEditStock = (product) => {
		setEditingStock(product._id);
		setStockValue(String(product.stock));
	};

	const stockColor = (stock) => {
		if (stock <= 0) return 'text-red-600 dark:text-red-400 font-semibold';
		if (stock <= 5) return 'text-amber-600 dark:text-amber-400 font-semibold';
		return '';
	};

	useEffect(() => {
		fetchList();
	}, []);

	const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold text-gray-800 dark:text-white">All Products</h1>
				<span className="rounded-full bg-gray-200 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
					{list.length}
				</span>
			</div>

			{/* Table Card */}
			<div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
				{/* Desktop Header */}
				<div className="hidden md:grid grid-cols-[1.2fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm">
					<b className="text-gray-600 dark:text-gray-400 font-medium">Image</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Name</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Category</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Stock</b>
					<b className="text-gray-600 dark:text-gray-400 font-medium">Price</b>
					<b className="text-center text-gray-600 dark:text-gray-400 font-medium">Actions</b>
				</div>

				{/* Product List */}
				{list
					.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
					.map((item) => (
					<div
						key={item._id}
						className={`flex flex-col gap-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0 bg-white dark:bg-gray-900 p-3 md:grid md:grid-cols-[1.2fr_3fr_1fr_1fr_1fr_1fr] md:items-center md:gap-4 md:p-4 ${
							item.stock <= 5 ? 'bg-amber-50/50 dark:bg-amber-900/20' : ''
						}`}>
						<img src={item.image[0]} className='h-16 w-16 shrink-0 rounded-lg object-cover md:h-12 md:w-12' alt={item.name} />
						<p className='min-w-0 truncate text-sm font-medium text-gray-800 dark:text-gray-100'>{item.name}</p>
						<p className='text-sm font-medium text-gray-700 dark:text-gray-300 md:hidden'>
							{CURRENCY}{item.price}
						</p>
						<p className='hidden text-sm text-gray-700 dark:text-gray-300 md:block'>{item.category}</p>
						{/* Desktop: inline stock editing */}
						<div className='hidden md:block'>
							{editingStock === item._id ? (
								<input
									type='number'
									value={stockValue}
									onChange={(e) => setStockValue(e.target.value)}
									onBlur={() => saveStock(item._id)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') saveStock(item._id);
										if (e.key === 'Escape') setEditingStock(null);
									}}
									min='0'
									autoFocus
									className='w-16 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 text-sm'
								/>
							) : (
								<button
									onClick={() => startEditStock(item)}
									className={`cursor-pointer rounded-lg px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${stockColor(item.stock)}`}
								>
									{item.stock}
								</button>
							)}
						</div>
						<p className='hidden text-sm text-gray-700 dark:text-gray-300 md:block'>
							{CURRENCY}{item.price}
						</p>
						<div className='hidden items-center justify-center gap-1 md:flex'>
							<button
								onClick={() => navigate(`/edit?id=${item._id}`)}
								aria-label='Edit product'
								className='cursor-pointer rounded-lg p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'>
								<Icon icon='solar:pen-bold' className='text-lg' />
							</button>
							<button
								onClick={() => removeProduct(item._id)}
								aria-label='Delete product'
								className='cursor-pointer rounded-lg p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'>
								<Icon icon='solar:trash-bin-trash-outline' className='text-lg' />
							</button>
						</div>
						{/* Mobile: second row */}
						<div className='flex items-center justify-between md:hidden'>
							<div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
								<span className='rounded-lg bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5'>{item.category}</span>
								<span className={stockColor(item.stock)}>
									Stock: {item.stock}
								</span>
							</div>
							<div className='flex items-center gap-1'>
								<button
									onClick={() => navigate(`/edit?id=${item._id}`)}
									aria-label='Edit product'
									className='cursor-pointer rounded-lg p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'>
									<Icon icon='solar:pen-bold' className='text-base' />
								</button>
								<button
									onClick={() => removeProduct(item._id)}
									aria-label='Delete product'
									className='cursor-pointer rounded-lg p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'>
									<Icon icon='solar:trash-bin-trash-outline' className='text-base' />
								</button>
							</div>
						</div>
					</div>
				))}

				{/* Empty state */}
				{list.length === 0 && (
					<div className="py-12 text-center">
						<Icon icon="solar:box-outline" className="mx-auto mb-3 text-4xl text-gray-300 dark:text-gray-600" />
						<p className="text-sm text-gray-400 dark:text-gray-500">No products yet</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='flex items-center justify-center gap-2 flex-wrap'>
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className='cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
						Prev
					</button>
					<span className='text-sm text-gray-600 dark:text-gray-400 sm:hidden'>
						{currentPage} / {totalPages}
					</span>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm hidden sm:inline-block transition-colors ${
									currentPage === page
										? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-700 dark:border-gray-700'
										: 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}>
								{page}
							</button>
						),
					)}
					<button
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
						className='cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default List;
