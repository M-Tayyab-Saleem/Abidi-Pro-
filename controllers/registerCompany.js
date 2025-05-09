const Company = require("../models/companyModel");
const Branch = require("../models/branchSchema");

// Create Company
exports.createCompany = async (req, res) => {
  const { name, address, logo, website, phoneNumber, companyType, branches, departments } = req.body;

  try {
    const newCompany = new Company({
      name,
      address,
      logo,
      website,
      phoneNumber,
      companyType,
      branches,
      departments,
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("branches departments admins employees");
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Company by ID
exports.getCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findById(id).populate("branches departments admins employees");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Company
exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, address, logo, website, phoneNumber, companyType, branches, departments } = req.body;

  try {
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.name = name || company.name;
    company.address = address || company.address;
    company.logo = logo || company.logo;
    company.website = website || company.website;
    company.phoneNumber = phoneNumber || company.phoneNumber;
    company.companyType = companyType || company.companyType;
    company.branches = branches || company.branches;
    company.departments = departments || company.departments;

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Company
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
