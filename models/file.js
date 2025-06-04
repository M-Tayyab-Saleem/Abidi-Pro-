const mongoose = require('mongoose');
const aclSchema = require('../models/aclSchema');


const fileSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  folderId:     { type: mongoose.Types.ObjectId, ref: 'Folder', required: false },
  cloudinaryId: { type: String, required: true },
  url:          { type: String, required: true },
  size:         { type: Number, required: true },
  mimeType:     { type: String, required: true },
  ownerId:      { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  acl:          [aclSchema],
  isDeleted: { type: Boolean, default: false } // 👈 added
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
