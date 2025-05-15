const File = require("../models/fileManagementSchema");

// CREATE
exports.createFile = async (req, res) => {
  const {
    fileName,
    sharedBy,
    sharingDate,
    shareTo,
    folderName,
    attachedFile,
    fileType
  } = req.body;

  try {
    const newFile = new File({
      fileName,
      sharedBy,
      sharingDate,
      shareTo,
      folderName,
      attachedFile,
      fileType
    });

    const savedFile = await newFile.save();
    res.status(201).json(savedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create file record" });
  }
};

// READ ALL
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate('sharedBy').populate('shareTo');
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

// READ BY ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('sharedBy').populate('shareTo');
    if (!file) return res.status(404).json({ message: "File not found" });
    res.status(200).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch file" });
  }
};

// UPDATE
exports.updateFile = async (req, res) => {
  const { id } = req.params;
  const {
    fileName,
    sharedBy,
    sharingDate,
    shareTo,
    folderName,
    attachedFile,
    fileType
  } = req.body;

  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    file.fileName = fileName || file.fileName;
    file.sharedBy = sharedBy || file.sharedBy;
    file.sharingDate = sharingDate || file.sharingDate;
    file.shareTo = shareTo || file.shareTo;
    file.folderName = folderName || file.folderName;
    file.attachedFile = attachedFile || file.attachedFile;
    file.fileType = fileType || file.fileType;

    const updated = await file.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update file" });
  }
};

// DELETE
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};
