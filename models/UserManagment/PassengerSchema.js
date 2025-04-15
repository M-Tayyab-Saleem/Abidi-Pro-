const mongoose = require('mongoose');
 
const passengerSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: true,
    },
    passengerContact: {
        type: String,
        required: true,
        unique: true
    },
    passengerEmail: {
        type: String
    },
    passengerRide: {
        type: Number
    },
    passengerGender: {
        type: String
    },
    passengerCardNumber: {
        type: Number
    },
    passengerImage: {
        url : String,
        filename : String
    },
}, { timestamps: true });
 
module.exports = mongoose.model('Ride Passenger', passengerSchema);