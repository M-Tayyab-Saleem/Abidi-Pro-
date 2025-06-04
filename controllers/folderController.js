const mongoose = require('mongoose');
const Folder = require('../models/folder');
const File = require('../models/file');

exports.getContents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.query.userId;
   


    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }
    const parentId =
      id === 'root'
        ? null
        : mongoose.isValidObjectId(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    if (id !== 'root' && parentId === null) {
      return res.status(400).json({ error: 'Invalid folder ID' });
    }

   const [folders, files] = await Promise.all([
  Folder.find({
    parentId,
    isDeleted: false,
    $or: [
      { ownerId: userId },
      { acl: { $elemMatch: { userId: userId } } }
    ]
  }).populate('ownerId').populate('acl.userId'),

  File.find({
    folderId: parentId,
    isDeleted: false,
    $or: [
      { ownerId: userId },
      { acl: { $elemMatch: { userId: userId } } }
    ]
  }).populate('ownerId').populate('acl.userId')
]);

    res.json({ folders, files });
  } catch (err) {
    console.error('Error in getContents:', err);
    next(err);
  }
};

// POST: Create new folder
exports.create = async (req, res, next) => {
  try {
    const { name, parentId, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ error: 'Folder name and ownerId are required' });
    }

    const folder = await Folder.create({
      name,
      parentId: parentId || null,
      ownerId,
      acl: [{ userId: req.user?.id || ownerId, role: 'owner' }]
    });

    res.status(201).json(folder);
  } catch (err) {
    console.error('Error creating folder:', err);
    next(err);
  }
};

// controllers/folder.controller.js

exports.softDeleteFolder = async (req, res) => {
  const { folderId } = req.params;
console.log("deleting folder", folderId)


  try {
    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { isDeleted: true },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json({ message: 'Folder deleted (soft)', folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
