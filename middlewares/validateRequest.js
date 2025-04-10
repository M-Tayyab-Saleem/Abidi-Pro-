const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.details[0].message // Returns the first error
      });
    }
    
    next(); // Proceed if validation passes
  };
};

module.exports = validateRequest;