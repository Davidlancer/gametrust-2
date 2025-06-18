const Joi = require('joi');

/**
 * Validation schema for user registration
 */
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    
    email: Joi.string()
      .email()
      .lowercase()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(6)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
        'any.required': 'Password is required'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      })
  });

  return schema.validate(data);
};

/**
 * Validation schema for user login
 */
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .messages({
        'any.required': 'Email or username is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data);
};

/**
 * Validation schema for profile update
 */
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters'
      }),
    
    avatar: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'Avatar must be a valid URL'
      }),
    
    socials: Joi.object({
      facebook: Joi.string().allow(null, ''),
      discord: Joi.string().allow(null, ''),
      twitter: Joi.string().allow(null, '')
    })
  });

  return schema.validate(data);
};

/**
 * Validation schema for password change
 */
const changePasswordValidation = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: Joi.string()
      .min(6)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.max': 'New password cannot exceed 128 characters',
        'string.pattern.base': 'New password must contain at least one lowercase letter, one uppercase letter, and one number',
        'any.required': 'New password is required'
      }),
    
    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'New passwords do not match',
        'any.required': 'New password confirmation is required'
      })
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
};