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
    passengerTotalRides: {
        type: Number
    },
    passengerGender: {
        type: String
    },
    passengerJoiningDate: {
        type: String
    },
    passengerImage: {
        url : String,
        filename : String
    },
}, { timestamps: true });
 
module.exports = mongoose.model('Ride Passenger', passengerSchema);