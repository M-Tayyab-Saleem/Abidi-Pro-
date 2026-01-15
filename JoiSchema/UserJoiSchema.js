const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Adjust regex if you want strict password rules
  
  // Enums must match Mongoose Schema
  role: Joi.string().valid("SuperAdmin", "Admin", "HR", "Manager", "Employee").default("Employee"),
  empType: Joi.string().valid("Permanent", "Contractor", "Intern", "Part Time").required(),
  empStatus: Joi.string().valid("Active", "Inactive"),
  
  // IDs (Must validate as MongoDB ObjectIds)
  empID: Joi.string().required(),
  department: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Department must be a valid ID"
  }),
  reportsTo: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ""), // Optional for CEO
  designation: Joi.string().required(),
  
  // Other fields
  joiningDate: Joi.date().required(),
  timeZone: Joi.string().required(),
  phoneNumber: Joi.number().required(),
  branch: Joi.string().required(),
  salary: Joi.number().allow(null),
  address: Joi.string().allow(""),
  about: Joi.string().allow(""),
  
  // Arrays (Simplified validation)
  experience: Joi.array().items(Joi.object().unknown(true)),
  education: Joi.array().items(Joi.object().unknown(true)),
  dashboardCards: Joi.array(),
  
  // Optional/System fields
  addedby: Joi.string(),
  avatar: Joi.string().allow("")
});

const userUpdateSchema = userSchema.fork(
  ["email", "password", "empID", "role", "empType", "joiningDate", "phoneNumber"],
  (schema) => schema.optional()
);

module.exports = {
  userSchema,
  userUpdateSchema,
};