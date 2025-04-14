const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleID: {
        type: String,
        unique: true
    },
    make: {
        type: String,
        required: true
    },
    carType: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    licensePlateNo: {
        type: String,
        required: true,
        unique: true
    },
    feul: {
        type: String,
        required: true
    },
    seat: {
        type: String
    },
    transmission: {
        type: String
    },
    vehicleDeclineReason: {
        type: String
    },
    vehicleReSubmit: {
        type: String
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RideDrivers',
        default: null
    },
    status: {
        type: String,
        enum: ['available', 'assigned', 'maintenance', 'pending'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);