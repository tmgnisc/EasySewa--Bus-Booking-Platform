import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for single image upload
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple image uploads
export const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

// Middleware for bus owner documents (bus photo + document)
export const uploadOwnerDocuments = upload.fields([
  { name: 'busPhoto', maxCount: 1 },
  { name: 'busDocument', maxCount: 1 }
]);

