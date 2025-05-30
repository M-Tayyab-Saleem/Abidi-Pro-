// controllers/folder.controller.js
const Folder = require('../models/folder');
const File = require('../models/file');


exports.getContents = async (req, res,next) => {
  try {
    const { id } = req.params;
    // interpret "root" as parentId = null
    const parentId = (id === 'root') 
      ? null 
      : // validate id before casting
        (mongoose.Types.ObjectId.isValid(id) 
          ? mongoose.Types.ObjectId(id) 
          : null);

    // optional: if non-root & invalid ObjectId, you could return 400
    if (id !== 'root' && parentId === null) {
      return res.status(400).json({ error: 'Invalid folder id' });
    }

    const [folders, files] = await Promise.all([
      Folder.find({ parentId }),
      File.find({ folderId: parentId })  // or however you store top-level files
    ]);
    res.json({ folders, files });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  const { name, parentId } = req.body;
  const folder = await Folder.create({
    name, parentId: parentId || null, ownerId: req.user.id,
    acl: [{ userId: req.user.id, role: 'owner' }]
  });
  res.json(folder);
};
