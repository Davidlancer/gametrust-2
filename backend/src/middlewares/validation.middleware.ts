import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../types';

/**
 * Middleware to validate request data against Joi schema
 * @param schema - Joi validation schema
 * @returns Express middleware function
 */
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      const response: ApiResponse = {
        success: false,
        message: 'Validation Error',
        errors
      };
      res.status(400).json(response);
      return;
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};