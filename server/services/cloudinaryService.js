import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (file, folder = null) => {
  try {
    const uploadOptions = {
      folder: folder || process.env.CLOUDINARY_ASSET_FOLDER || 'fyp',
      resource_type: 'auto',
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'finalyearproject'
    };

    // If file is a buffer (from multer)
    if (file.buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id
              });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    }
    
    // If file is a path or URL
    const result = await cloudinary.uploader.upload(file.path || file, uploadOptions);
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = null) => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.url);
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

