import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errorClasses';

// Generic validation middleware
export function validateRequest<T>(validator: (data: any) => { valid: boolean; errors: string[] }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { valid, errors } = validator(req.body);
    
    if (!valid) {
      return next(new BadRequestError(`Validation error: ${errors.join(', ')}`));
    }
    
    next();
  };
}

// Validator for creating notes
export function validateNote(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title) {
    errors.push('Title is required');
  } else if (data.title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }
  
  if (!data.content) {
    errors.push('Content is required');
  }
  
  // categoryId is optional, so we don't check for its presence
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validator for updating notes
export function validateNoteUpdate(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.title !== undefined && data.title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }
  
  // Other fields are optional with no specific validation constraints
  
  return {
    valid: errors.length === 0,
    errors
  };
}