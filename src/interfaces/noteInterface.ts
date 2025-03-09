export interface INote {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
export interface INoteDocument extends INote, Document {
    _id: string;
  }