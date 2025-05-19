const File = require("../models/fileManagementSchema");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError, BadRequestError } = require("../utils/ExpressError");

// CREATE
exports.createFile = catchAsync(async (req, res) => {
  const {
    fileName,
    sharedBy,
    sharingDate,
    shareTo,
    folderName,
    attachedFile,
    fileType
  } = req.body;

  if (!fileName || !sharedBy || !shareTo) {
    throw new BadRequestError("Missing required fields");
  }

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
});

// READ ALL
exports.getAllFiles = catchAsync(async (req, res) => {
  const files = await File.find().populate('sharedBy').populate('shareTo');
  res.status(200).json(files);
});

// READ BY ID
exports.getFileById = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id).populate('sharedBy').populate('shareTo');
  if (!file) throw new NotFoundError("File");
  res.status(200).json(file);
});

// UPDATE
exports.updateFile = catchAsync(async (req, res) => {
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

  const file = await File.findById(id);
  if (!file) throw new NotFoundError("File");

  file.fileName = fileName || file.fileName;
  file.sharedBy = sharedBy || file.sharedBy;
  file.sharingDate = sharingDate || file.sharingDate;
  file.shareTo = shareTo || file.shareTo;
  file.folderName = folderName || file.folderName;
  file.attachedFile = attachedFile || file.attachedFile;
  file.fileType = fileType || file.fileType;

  const updated = await file.save();
  res.status(200).json(updated);
});

// DELETE
exports.deleteFile = catchAsync(async (req, res) => {
  const file = await File.findByIdAndDelete(req.params.id);
  if (!file) throw new NotFoundError("File");
  res.status(200).json({ message: "File deleted successfully" });
});
