const companyModal = require("../models/companyModel");

exports.registerCompany= async (req, res) => {
  try {
    const { name, address } = req.body;
    const company = new companyModal({ name, address });
    await company.save();
    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}