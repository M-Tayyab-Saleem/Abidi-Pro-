const Zone = require("../../models/Zone/zoneSetup");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");

const getAllZones = async (req, res) => {
  const zones = await Zone.find({}).sort({ createdAt: -1 });
  res.status(200).json(zones);
};

const getZoneById = async (req, res) => {
  const { id } = req.params;
  const zone = await Zone.findById(id);
  if (!zone) {
    throw new NotFoundError("Zone");
  }
  res.status(200).json(zone);
};

const createZone = async (req, res) => {
  const { zoneName, tripRequestVolume, extraFarePercentage } = req.body;
  
  const existingZone = await Zone.findOne({ zoneName });
  if (existingZone) {
    throw new BadRequestError("Zone with this name already exists");
  }

  const zone = new Zone({
    zoneName,
    tripRequestVolume,
    extraFarePercentage
  });
  await zone.save();

  res.status(201).json(zone);
};

const updateZone = async (req, res) => {
  const { id } = req.params;
  const { zoneName, tripRequestVolume, extraFarePercentage } = req.body;

  const zone = await Zone.findById(id);
  if (!zone) {
    throw new NotFoundError("Zone");
  }

  if (zoneName && zoneName !== zone.zoneName) {
    const existingZone = await Zone.findOne({ zoneName });
    if (existingZone) {
      throw new BadRequestError("Zone with this name already exists");
    }
    zone.zoneName = zoneName;
  }

  zone.tripRequestVolume = tripRequestVolume || zone.tripRequestVolume;
  zone.extraFarePercentage = extraFarePercentage || zone.extraFarePercentage;
  await zone.save();

  res.status(200).json(zone);
};

const deleteZone = async (req, res) => {
  const { id } = req.params;
  const zone = await Zone.findByIdAndDelete(id);
  if (!zone) {
    throw new NotFoundError("Zone");
  }
  res.status(200).json({ message: "Zone deleted successfully" });
};

module.exports = {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
};