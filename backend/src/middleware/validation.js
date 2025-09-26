import Joi from 'joi';

/**
 * Validation schemas
 */
const promptSchema = Joi.object({
  prompt: Joi.string().min(10).max(2000).required(),
  context: Joi.object().optional()
});

const projectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  template: Joi.string().valid('blank', 'dashboard', 'ecommerce', 'blog', 'portfolio').optional()
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(1).max(100).required()
});

/**
 * Middleware to validate prompt requests
 */
export const validatePrompt = (req, res, next) => {
  const { error } = promptSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
  
  next();
};

/**
 * Middleware to validate project creation/update
 */
export const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
  
  next();
};

/**
 * Middleware to validate user registration
 */
export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
  
  next();
};

/**
 * Generic validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message
      });
    }
    
    next();
  };
};