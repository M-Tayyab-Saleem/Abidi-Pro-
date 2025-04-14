const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    driverID: {
        type: String
    },
    driverName: {
        type: String,
        required: true
    },
    driverContact: {
        type: String,
        unique: true,
        required: true
    },
    driverEarning: {
        type: String
    },
    driverJoiningDate: {
        type: String
    },
    driverAge: {
        type: String
    },
    driverGender: {
        type: String
    },
    driverRating: {
        type: String
    },
    driverCnic: {
        type: String,
        unique: true
    },
    driverCardNumber: {
        type: String,
        unique: true
    },
    driverTotalTrips: {
        type: String
    },
    driverEmail: {
        type: String,
        unique: true
    },
    driverCity: {
        type: String
    },
    driverBankName: {
        type: String
    },
    driverIban: {
        type: String,
        unique: true
    },    
    driverBirthDate: {
        type: String
    },
    lastseen: {
        type: String
    },
    driverDeclineReason: {
        type: String
    },
    driverReSubmit: {
        type: String
    },
    assignedVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });
 
module.exports = mongoose.model('RideDrivers', DriverSchema);











// const mongoose = require('mongoose');

// const DriverSchema = new mongoose.Schema({
//     driverID: {
//         type: String,
//     },
//     driverName: {
//         type: String,
//     },
//     driverContact: {
//         type: String,
//         unique: true
//     },
//     driverEarning: {
//         type: String
//     },
//     driverJoiningDate: {
//         type: String,
//     },
//     driverAge: {
//         type: String,
//     },
//     driverGender: {
//         type: String
//     },
//     driverRating: {
//         type: String,
//     },
//     driverCnic: {
//         type: String,
//         unique: true
//     },
//     driverCardNumber: {
//         type: String,
//         unique: true
//     },
//     driverTotalTrips: {
//         type: String
//     },
//     driverEmail: {
//         type: String,
//         unique: true
//     },
//     driverAssignedVehicle: {
//         type: String,
//     },
//     driverCity: {
//         type: String,
//     },
//     driverBankName: {
//         type: String,
//     },
//     driverIban: {
//         type: String,
//         unique: true
//     },    
//     driverBirthDate: {
//         type: String,
//     },
    
//     lastseen : {
//         type: String,
//     },
//     /////////////////////////////////////Decline Reason/////////////////////////////////////

//     driverDeclineReason: {
//         type: String,
//     },
//     driverReSubmit: {
//         type: String,
//     },

    
//     vehicleDeclineReason: {
//         type: String,
//     },
//     vehicleReSubmit: {
//         type: String,
//     },
//     // Vehicle Data 
//     make : {
//         type : String,
//     },
//     carType : {
//         type : String,
//     },
//     color : {
//         type : String,
//     },
//     year : {
//         type : String,
//     },
//     owner : {
//         type : String,
//     },
//     licensePlateNo: {
//         type: String,
//         unique : true
//     },
//     feul : {
//         type : String,
//     },
//    seat : {
//         type : String,
//     },
//     transmission : {
//         type : String
//     },
//     // registrationBook : {
//     //     type : PNG,
//     //     required : true,
//     // },
//     // insuarance : {
//     //     type : PNG
//     // },

// }, { timestamps: true });
 
// module.exports = mongoose.model('RideDriverVehicles', DriverSchema);



    // driverStatus: {
    //     type: Number
    // },
    // driverProfilePic: {
    //     type: String
    // },
    // driverCurrentLocation: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // driverLicensePicture: {
    //     type: PNG,
    //     required: true,
    //     unique: true
    // },
    // driverCnicPicture: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

