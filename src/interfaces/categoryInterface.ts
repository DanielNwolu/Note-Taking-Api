export interface ICategory {
    _id?: string;
    name: string;
    description?: string;
    color?: string;
  }
  
  export interface ICategoryDocument extends ICategory, Document {
    _id: string;
  }