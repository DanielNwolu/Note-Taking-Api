import { Request, Response, NextFunction } from 'express';
import Note from '../models/noteModel';
import Category from '../models/categoryModel';
import { NotFoundError, BadRequestError } from '../utils/errorClasses';
import { CreateNoteRequest, UpdateNoteRequest } from '../interfaces/noteInterface';

// Get all notes (existing function)
export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notes = await Note.find()
      .populate('category', 'name color')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: notes.length,
      data: {
        notes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific note (existing function, updated)
export const getNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id).populate('category', 'name color');
    
    if (!note) {
      return next(new NotFoundError(`Note with ID ${req.params.id} not found`));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        note
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new note (updated to include category)
export const createNote = async (
  req: Request<{}, {}, CreateNoteRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, categoryId } = req.body;
    
    // If categoryId is provided, check if category exists
    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return next(new BadRequestError(`Category with ID ${categoryId} not found`));
      }
    }
    
    const newNote = await Note.create({
      title,
      content,
      category: categoryId || null
    });
    
    // Populate the category field for the response
    const populatedNote = await Note.findById(newNote._id).populate('category', 'name color');
    
    res.status(201).json({
      status: 'success',
      data: {
        note: populatedNote
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a note (new function)
export const updateNote = async (
  req: Request<{ id: string }, {}, UpdateNoteRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, categoryId } = req.body;
    
    // If categoryId is provided, check if category exists
    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return next(new BadRequestError(`Category with ID ${categoryId} not found`));
      }
    }
    
    const updateData: UpdateNoteRequest = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { 
        ...updateData,
        category: categoryId // Update the category field with the provided categoryId
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run validators on update
      }
    ).populate('category', 'name color');
    
    if (!updatedNote) {
      return next(new NotFoundError(`Note with ID ${req.params.id} not found`));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        note: updatedNote
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a note (existing function)
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return next(new NotFoundError(`Note with ID ${req.params.id} not found`));
    }
    
    res.status(204).end();
  }
  catch (error) {
    next(error);
  }
};

// Get notes by category (new function)
export const getNotesByCategory = async (
  req: Request<{ categoryId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    
    // Verify category exists
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return next(new NotFoundError(`Category with ID ${categoryId} not found`));
    }
    
    const notes = await Note.find({ category: categoryId })
      .populate('category', 'name color')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: notes.length,
      data: {
        category: categoryId,
        notes
      }
    });
  } catch (error) {
    next(error);
  }
};