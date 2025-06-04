// controllers/file.controller.js
const File = require('../models/file');
const cloudinary = require('../config/cloudinaryConfig');
const aclSchema = require('../models/aclSchema');


exports.register = async (req, res) => {
  const { name, folderId, cloudinaryId, url, size, mimeType } = req.body;
  console.log("registering file",name)
  // TODO: check ACL on folderId
  const file = await File.create({
    name, folderId,
    cloudinaryId, url, size, mimeType,
    ownerId: req.user.id,
    acl: [{ userId: req.user.id, role: 'owner' }]
  });
  res.json(file);
};

exports.downloadUrl = async (req, res) => {
  const file = await File.findById(req.params.fileId);
  // TODO: check ACL on file
  const downloadUrl = cloudinary.url(file.cloudinaryId, {
    type:      'authenticated',
    expires:   Math.floor(Date.now()/1000) + 300
  });
  res.json({ downloadUrl });
};

// controllers/file.controller.js

// controllers/file.controller.js

exports.softDeleteFile = async (req, res) => {
  const { fileId } = req.params;
console.log("deleting file", fileId)
  try {
    const file = await File.findByIdAndUpdate(
      fileId,
      { isDeleted: true },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted (soft)', file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

