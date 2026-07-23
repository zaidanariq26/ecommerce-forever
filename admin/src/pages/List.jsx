import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CURRENCY } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const List = ({ token }) => {
	const [list, setList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
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
				console.log(response.data.success);
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	return (
		<div>
			<p className='mb-2'>All Products List</p>
			<div className='flex flex-col gap-2'>
				{/*  ------ List Table Title ------ */}

			<div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
				<b>Image</b>
				<b>Name</b>
				<b>Category</b>
				<b>Stock</b>
				<b>Price</b>
				<b className='text-center'>Actions</b>
			</div>

				{/* ------ Product List ------ */}

				{list
					.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
					.map((item, index) => (
				<div
					key={item._id}
					className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border text-sm'>
					<img src={item.image[0]} className='w-12' alt={item.name} />
					<p>{item.name}</p>
					<p>{item.category}</p>
					<p className={item.stock <= 0 ? 'text-red-500 font-semibold' : ''}>{item.stock}</p>
					<p>
						{CURRENCY}
						{item.price}
					</p>
					<p
						onClick={() => navigate(`/edit?id=${item._id}`)}
						className='text-right md:text-center cursor-pointer text-lg text-blue-600 mr-3 inline-block'>
						E
					</p>
					<p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>
						X
					</p>
				</div>
				))}
			</div>

			{list.length > ITEMS_PER_PAGE && (
				<div className='mt-4 flex items-center justify-center gap-2 flex-wrap'>
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className='cursor-pointer border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40'>
						Prev
					</button>
					<span className='text-sm text-gray-600 sm:hidden'>
						{currentPage} / {Math.ceil(list.length / ITEMS_PER_PAGE)}
					</span>
					{Array.from({ length: Math.ceil(list.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(
						(page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`cursor-pointer border px-3 py-1 text-sm hidden sm:inline-block ${
									currentPage === page ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:bg-gray-100'
								}`}>
								{page}
							</button>
						),
					)}
					<button
						onClick={() => setCurrentPage((p) => Math.min(Math.ceil(list.length / ITEMS_PER_PAGE), p + 1))}
						disabled={currentPage === Math.ceil(list.length / ITEMS_PER_PAGE)}
						className='cursor-pointer border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40'>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default List;
