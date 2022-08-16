export interface SubCategoriesModelServer{
    id: number;
    title: string;
    cat_id: number;
    category: string;
  }
  
  export interface ServerResponse{
    categories: SubCategoriesModelServer[];
  }