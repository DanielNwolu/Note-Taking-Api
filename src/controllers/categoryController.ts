import { Request, Response, NextFunction } from 'express';
import Category from '../models/categoryModel';
import { BadRequestError, NotFoundError } from '../utils/errorClasses';

// Create a new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return next(new BadRequestError('Category name is required'));
    }
    
    const newCategory = await Category.create({
      name,
      description,
      color
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find();
    
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};