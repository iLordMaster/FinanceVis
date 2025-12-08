const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Readable } = require("node:stream");

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer and upload to Cloudinary in a follow-up middleware.
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype && file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file format. Only images are allowed."), false);
		}
	},
});

// Returns an array of middlewares: multer single + cloudinary upload
function singleUploadToCloudinary(fieldName, options = {}) {
	const folder = options.folder || "profile_pictures";
	const transformation = options.transformation || [
		{ width: 500, height: 500, crop: "limit" },
	];

	return [
		upload.single(fieldName),
		async (req, res, next) => {
			try {
				if (!req.file || !req.file.buffer) return next();

				const upload_stream = cloudinary.uploader.upload_stream(
					{ folder, transformation, resource_type: "image" },
					(error, result) => {
						if (error) return next(error);
						// Keep backwards compatibility with previous code that used `req.file.path`
						req.file.path = result.secure_url || result.url;
						req.file.public_id = result.public_id;
						next();
					}
				);

				const readable = new Readable();
				readable._read = () => {}; // _read is required but you can noop it
				readable.push(req.file.buffer);
				readable.push(null);
				readable.pipe(upload_stream);
			} catch (err) {
				next(err);
			}
		},
	];
}

module.exports = { cloudinary, upload, singleUploadToCloudinary };
