import multer from 'multer';

const storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, file.originalname);
	},
});

const fileFilter = (req, file, callback) => {
	const allowed = ['image/jpeg', 'image/png', 'image/webp'];
	if (allowed.includes(file.mimetype)) {
		callback(null, true);
	} else {
		callback(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
	}
};

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter,
});

export default upload;
