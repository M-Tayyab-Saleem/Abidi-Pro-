const Company = require("../models/companySchema");
const Branch = require("../models/branchSchema");

// Create Company
exports.createCompany = async (req, res) => {
  const {
    companyName,
    companyOwner,
    contactNo,
    companyEmail,
    website,
    address,
    noOfEmployees,
    noOfApps,
    aboutCompany,
    companyLogo,
    companyType
  } = req.body;

  try {
    const newCompany = new Company({
      companyName,
      companyOwner,
      contactNo,
      companyEmail,
      website,
      address,
      noOfEmployees,
      noOfApps,
      aboutCompany,
      companyLogo,
      companyType
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create company" });
  }
};


// Get All Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
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
    const company = await Company.findById(id)

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const {
    companyName,
    companyOwner,
    contactNo,
    companyEmail,
    website,
    address,
    noOfEmployees,
    noOfApps,
    aboutCompany,
    companyLogo,
    companyType
  } = req.body;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.companyName = companyName || company.companyName;
    company.companyOwner = companyOwner || company.companyOwner;
    company.contactNo = contactNo || company.contactNo;
    company.companyEmail = companyEmail || company.companyEmail;
    company.website = website || company.website;
    company.address = address || company.address;
    company.noOfEmployees = noOfEmployees || company.noOfEmployees;
    company.noOfApps = noOfApps || company.noOfApps;
    company.aboutCompany = aboutCompany || company.aboutCompany;
    company.companyLogo = companyLogo || company.companyLogo;
    company.companyType = companyType || company.companyType;

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update company" });
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
