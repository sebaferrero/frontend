export interface CategoriesModelServer{
    id: number;
    title: string;
  }
  
  export interface ServerResponse{
    categories: CategoriesModelServer[];
  }