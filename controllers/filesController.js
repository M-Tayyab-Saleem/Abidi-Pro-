// controllers/file.controller.js
const File = require('../models/file');
const cloudinary = require('../config/cloudinaryConfig');
const aclSchema = require('../models/cloudinary');


exports.register = async (req, res) => {
  const { name, folderId, cloudinaryId, url, size, mimeType } = req.body;
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
