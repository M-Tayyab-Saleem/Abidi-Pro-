const mongoose = require('mongoose');
const aclSchema = require('../models/cloudinary');


const fileSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  folderId:     { type: mongoose.Types.ObjectId, ref: 'Folder', required: true },
  cloudinaryId: { type: String, required: true },
  url:          { type: String, required: true },
  size:         { type: Number, required: true },
  mimeType:     { type: String, required: true },
  ownerId:      { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  acl:          [aclSchema],
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
