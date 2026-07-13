import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Edit = ({ token }) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const productId = searchParams.get('id');

	const [image1, setImage1] = useState(false);
	const [image2, setImage2] = useState(false);
	const [image3, setImage3] = useState(false);
	const [image4, setImage4] = useState(false);

	const [existingImages, setExistingImages] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('Men');
	const [subCategory, setSubCategory] = useState('Topwear');
	const [bestseller, setBestseller] = useState(false);
	const [sizes, setSizes] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchProduct = async () => {
		try {
			const response = await axios.post(BACKEND_URL + '/api/product/single', { productId });
			if (response.data.success) {
				const p = response.data.product;
				setName(p.name);
				setDescription(p.description);
				setPrice(p.price);
				setCategory(p.category);
				setSubCategory(p.subCategory);
				setBestseller(p.bestseller);
				setSizes(p.sizes || []);
				setExistingImages(p.image || []);
			} else {
				toast.error('Product not found');
				navigate('/list');
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
			navigate('/list');
		}
	}, [productId, navigate]);

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('id', productId);
			formData.append('name', name);
			formData.append('description', description);
			formData.append('price', price);
			formData.append('category', category);
			formData.append('subCategory', subCategory);
			formData.append('bestseller', bestseller);
			formData.append('sizes', JSON.stringify(sizes));

			image1 && formData.append('image1', image1);
			image2 && formData.append('image2', image2);
			image3 && formData.append('image3', image3);
			image4 && formData.append('image4', image4);

			const response = await axios.post(BACKEND_URL + '/api/product/update', formData, {
				headers: { token },
			});

			if (response.data.success) {
				toast.success(response.data.message);
				navigate('/list');
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const toggleSize = (size) => {
		setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
	};

	if (loading) {
		return <p>Loading product...</p>;
	}

	return (
		<form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
			<div>
				<p className='mb-2'>Upload Image (leave empty to keep existing)</p>
				<div className='flex gap-2'>
					{existingImages.length > 0 &&
						existingImages.map((img, i) => (
							<img key={i} src={img} className='w-20 opacity-50' alt='' />
						))}
				</div>
				<p className='mt-2 mb-2 text-sm text-gray-500'>New images (optional):</p>
				<div className='flex gap-2'>
					<label htmlFor='image1'>
						<img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt='' />
						<input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden />
					</label>
					<label htmlFor='image2'>
						<img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt='' />
						<input onChange={(e) => setImage2(e.target.files[0])} type='file' id='image2' hidden />
					</label>
					<label htmlFor='image3'>
						<img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt='' />
						<input onChange={(e) => setImage3(e.target.files[0])} type='file' id='image3' hidden />
					</label>
					<label htmlFor='image4'>
						<img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt='' />
						<input onChange={(e) => setImage4(e.target.files[0])} type='file' id='image4' hidden />
					</label>
				</div>
			</div>

			<div className='w-full'>
				<p className='mb-2'>Product name</p>
				<input
					onChange={(e) => setName(e.target.value)}
					value={name}
					className='w-full max-w-[500px] px-3 py-2'
					type='text'
					placeholder='Type here'
					required
				/>
			</div>

			<div className='w-full'>
				<p className='mb-2'>Product description</p>
				<textarea
					onChange={(e) => setDescription(e.target.value)}
					value={description}
					className='w-full max-w-[500px] px-3 py-2'
					placeholder='Write content here'
					required
				/>
			</div>

			<div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
				<div>
					<p className='mb-2'>Product category</p>
					<select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
						<option value='Men'>Men</option>
						<option value='Women'>Women</option>
						<option value='Kids'>Kids</option>
					</select>
				</div>

				<div>
					<p className='mb-2'>Sub category</p>
					<select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
						<option value='Topwear'>Topwear</option>
						<option value='Bottomwear'>Bottomwear</option>
						<option value='Winterwear'>Winterwear</option>
					</select>
				</div>

				<div>
					<p className='mb-2'>Product Price</p>
					<input
						onChange={(e) => setPrice(e.target.value)}
						value={price}
						type='number'
						className='w-full px-3 py-2 sm:w-[120px]'
						placeholder='0'
					/>
				</div>
			</div>

			<div>
				<p className='mb-2'>Product Sizes</p>
				<div className='flex gap-3'>
					{['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
						<div key={size} onClick={() => toggleSize(size)}>
							<p className={`${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>{size}</p>
						</div>
					))}
				</div>
			</div>

			<div className='flex gap-2 mt-2'>
				<input onChange={() => setBestseller((prev) => !prev)} type='checkbox' id='bestseller' checked={bestseller} />
				<label className='cursor-pointer' htmlFor='bestseller'>
					Add to bestseller
				</label>
			</div>

			<div className='flex gap-3 mt-4'>
				<button type='submit' className='w-28 py-3 bg-gray-900 text-white'>
					UPDATE
				</button>
				<button type='button' onClick={() => navigate('/list')} className='w-28 py-3 bg-gray-300 text-gray-700'>
					CANCEL
				</button>
			</div>
		</form>
	);
};

export default Edit;
