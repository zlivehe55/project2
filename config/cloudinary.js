const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                process.env.CLOUDINARY_API_KEY && 
                                process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured');
} else {
  console.log('⚠️ Cloudinary not configured - using local storage');
}

// Local disk storage fallback
const localProjectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/projects');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const localContractorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/contractors');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Cloudinary storage
const cloudinaryProjectStorage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'craftycrib/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }]
  }
}) : null;

const cloudinaryContractorStorage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'craftycrib/contractors',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
  }
}) : null;

const cloudinaryAvatarStorage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'craftycrib/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }]
  }
}) : null;

// File filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed (JPG, PNG, WebP)'));
};

// Multer upload instances - use Cloudinary if configured, otherwise local storage
const uploadProjectImages = multer({ 
  storage: isCloudinaryConfigured ? cloudinaryProjectStorage : localProjectStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter
});

const uploadContractorImages = multer({ 
  storage: isCloudinaryConfigured ? cloudinaryContractorStorage : localContractorStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter
});

const uploadAvatar = multer({ 
  storage: isCloudinaryConfigured ? cloudinaryAvatarStorage : localProjectStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

// Helper to get the correct URL from uploaded file
const getImageUrl = (file) => {
  if (isCloudinaryConfigured && file.path) {
    // Cloudinary returns full URL in file.path
    return file.path;
  }
  // Local storage - return relative path
  return `/uploads/projects/${file.filename}`;
};

const getContractorImageUrl = (file) => {
  if (isCloudinaryConfigured && file.path) {
    return file.path;
  }
  return `/uploads/contractors/${file.filename}`;
};

// Helper to delete image from Cloudinary
const deleteImage = async (publicId) => {
  if (!isCloudinaryConfigured) {
    // For local storage, deletion should be handled differently
    return true;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadProjectImages,
  uploadContractorImages,
  uploadAvatar,
  deleteImage,
  getImageUrl,
  getContractorImageUrl
};
