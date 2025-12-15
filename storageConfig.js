const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Main storage for general files
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "abidiPro",
    allowedFormats: ["png", "jpeg", "jpg", "pdf"],
  },
});

// User profile photos storage
const userProfileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "abidiPro/users/profile_photos",
    allowedFormats: ["png", "jpeg", "jpg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// TimeLogs attachments storage
const timeLogsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "abidiPro/timeLogs/attachments",
    allowedFormats: ["png", "jpeg", "jpg", "pdf", "doc", "docx"],
    resource_type: "raw",
  },
});

const commonFileParams = {
  resource_type: "auto",
  use_filename: true,
  unique_filename: false,
  overwrite: false,
  transformation: { quality: "auto:good" } // Optimize quality
};

// Timesheets attachments storage
const timesheetsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "abidiPro/timesheets/attachments",
    allowedFormats: ["png", "jpeg", "jpg", "pdf", "doc", "docx"],
    resource_type: "raw",
  },
});

// Main file storage
const fileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    ...commonFileParams,
    folder: "abidiPro/files",
    allowed_formats: ["png", "jpeg", "jpg", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
    format: async (req, file) => {
      // Preserve original format
      return file.originalname.split('.').pop().toLowerCase();
    },
    public_id: (req, file) => {
      // Generate unique public_id with timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}`;
    }
  }
});

// Folder thumbnail storage
const folderStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    ...commonFileParams,
    folder: "abidiPro/folders/thumbnails",
    allowed_formats: ["png", "jpeg", "jpg"],
    transformation: [
      { width: 300, height: 200, crop: "fill", gravity: "auto" }
    ]
  }
});

module.exports = {
  cloudinary,
  storage,
  fileStorage,
  folderStorage,
  userProfileStorage,
  timeLogsStorage,
  timesheetsStorage,
};
