const mongoose = require('mongoose');
const aclSchema = require('../models/cloudinary');


const folderSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  parentId:  { type: mongoose.Types.ObjectId, ref: 'Folder', default: null },
  ownerId:   { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  acl:       [aclSchema],
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);

