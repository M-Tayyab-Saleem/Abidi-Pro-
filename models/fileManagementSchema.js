const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharingDate: {
    type: Date,
    default: () => Date.now(),
    required: true
  },
  shareTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  folderName: {
    type: String,
    required: true
  },
  attachedFile: {
    type: String
  },
  fileType: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
