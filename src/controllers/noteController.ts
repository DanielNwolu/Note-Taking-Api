import { Request, Response, NextFunction } from 'express';
import Note from '../models/noteModel';
import { NotFoundError, BadRequestError } from '../utils/errorClasses';

// Get all notes
export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    
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

// Get a specific note
export const getNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    
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

// Create a new note
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return next(new BadRequestError('Title and content are required'));
    }
    
    const newNote = await Note.create({
      title,
      content
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        note: newNote
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a note
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
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};