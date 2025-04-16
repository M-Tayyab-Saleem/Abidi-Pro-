const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'rideapp',
        allowedFormats: ["png", "jpeg", "jpg"],
    },
});

// Create separate storage instances for different upload needs if needed
const driverDocsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'rideapp/driver_docs',
        allowedFormats: ["png", "jpeg", "jpg"],
    },
});

// Create separate storage instances for different upload needs if needed
const vehicleDocsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'rideapp/vehicle_docs',
        allowedFormats: ["png", "jpeg", "jpg"],
    },
});

module.exports = {
    cloudinary, 
    storage,
    driverDocsStorage,
    vehicleDocsStorage
}
   