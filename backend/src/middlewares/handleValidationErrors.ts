import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types';

/**
 * Middleware to handle express-validator validation errors
 * Should be used after validation chains
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    
    const errorMessages = errors.array().map(error => error.msg);
    
    // Check if we have required field errors
    const requiredFieldErrors = errorMessages.filter(msg => 
      msg.includes('is required')
    );
    
    let message: string;
    
    // If we have multiple required field errors, show generic message
    if (requiredFieldErrors.length > 1) {
      message = 'Email, username, and password are required';
    } else {
      // Otherwise, show the first error message
      message = errorMessages[0];
    }
    
    const response: ApiResponse = {
      success: false,
      message,
      errors: errorMessages
    };
    
    res.status(400).json(response);
    return;
  }
  
  next();
};