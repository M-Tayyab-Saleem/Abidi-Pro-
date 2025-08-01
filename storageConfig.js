const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Main storage for general files
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'abidiPro',
        allowedFormats: ["png", "jpeg", "jpg", "pdf"],
    },
});

// User profile photos storage
const userProfileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'abidiPro/users/profile_photos',
        allowedFormats: ["png", "jpeg", "jpg"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    },
});

// TimeLogs attachments storage
const timeLogsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'abidiPro/timeLogs/attachments',
        allowedFormats: ["png", "jpeg", "jpg", "pdf"],
    },
});

// Timesheets attachments storage
const timesheetsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'abidiPro/timesheets/attachments',
        allowedFormats: ["png", "jpeg", "jpg", "pdf"],
    },
});

module.exports = {
    cloudinary, 
    storage,
    userProfileStorage,
    timeLogsStorage,
    timesheetsStorage
};