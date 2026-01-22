import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// --- Configure Multer Storage ---
const storage = multer.diskStorage({
  // Set destination folder
  destination(req, file, cb) {
    // --- THIS IS THE FIX ---
    // Changed 'backend/public/uploads/' to 'public/uploads/'
    // This is relative to where server.js is running (which is the backend folder)
    cb(null, 'public/uploads/');
  },
  // Set filename
  filename(req, file, cb) {
    // Create a unique filename: fieldname-date-extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// --- File Filter (Optional but recommended) ---
// Ensure only image files are uploaded
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, gif, webp)'), false);
  }
}

// --- Initialize Multer Middleware ---
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// --- Define the Upload Route ---
// @route   POST /api/upload
// @desc    Upload an image
// @access  Private (requires 'protect' middleware)
// 'protect' middleware isn't here, but we'll add it in server.js
// We use 'upload.single('image')' - 'image' must match the FormData key
router.post('/', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }
  
  // File was successfully uploaded by multer.
  // We return the path so the frontend can use it.
  // IMPORTANT: We return a URL-friendly path
  res.status(200).json({
    msg: 'Image uploaded successfully',
    // This path is correct because of the static serving in server.js
    imageUrl: `/uploads/${req.file.filename}`,
  });
}, (err, req, res, next) => {
    // This handles errors from multer (e.g., file size, file type)
    res.status(400).json({ msg: err.message });
});

export default router;