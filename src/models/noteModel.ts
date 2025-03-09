import mongoose, { Schema } from 'mongoose';
import { INote } from '../interfaces/noteInterface';

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;