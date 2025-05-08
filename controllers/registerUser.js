const companyModal = require("../models/companyModel");
const UserSchema = require("../models/UserSchema");

exports.registerUser=async (req, res) => {
    try {
      const { username, password, role, companyId } = req.body;
      const company = await companyModal.findById(companyId);
      if (!company) return res.status(404).json({ message: "Company not found" });
  
      const user = new UserSchema({ username, password, role, company: companyId });
      await user.save();
  
      if (role === "Admin") {
        company.admins.push(user._id);
        await company.save();
      }
  
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }