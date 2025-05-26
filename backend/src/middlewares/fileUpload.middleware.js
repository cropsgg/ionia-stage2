import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config/index.js';

// Define the temp directory path
const tempDir = "./backend/public/temp";

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("Created temp directory for file uploads:", tempDir);
}

// Define allowed file types for security
const allowedTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'video/avi'
];

// Allowed image types for profile uploads
const allowedImageTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif'
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with no spaces
    const sanitizedName = file.originalname.replace(/\s+/g, '_');
    const uniqueFilename = `${uuidv4()}-${sanitizedName}`;
    cb(null, uniqueFilename);
  }
});

// Enhanced file filter for homework attachments
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Basic image filter for avatars/profiles
const imageFileFilter = (req, file, cb) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed. Allowed types: ${allowedImageTypes.join(', ')}`), false);
  }
};

// Standard upload for images (avatars, etc.)
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFileFilter
});

// Enhanced upload for homework attachments
export const homeworkUpload = multer({
  storage,
  limits: { 
    fileSize: CONFIG.CLOUDINARY.MAX_FILE_SIZE, // 10MB from config
    files: 10 // Maximum 10 files per homework
  },
  fileFilter: fileFilter
});

// Upload for homework submissions (slightly more restrictive)
export const submissionUpload = multer({
  storage,
  limits: { 
    fileSize: CONFIG.CLOUDINARY.MAX_FILE_SIZE, // 10MB from config
    files: 5 // Maximum 5 files per submission
  },
  fileFilter: fileFilter
});

// Export allowed types for validation in other modules
export { allowedTypes, allowedImageTypes }; 