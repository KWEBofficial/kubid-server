export enum Status {
  Progress = 'progress',
  Complete = 'complete',
}

export interface ProductDTO {
  id: number;
  product_name: string;
  user_id: number;
  status: Status;
  currentHighestPrice: number;
  upperBound: number;
  imageId: number;
<<<<<<< HEAD
=======
  tags: string[];
  tradeLocation: string;
  tradeDate: string;
>>>>>>> bbfafb12889d041a16a396b498e41b466b32836d
  departmentId: number;
  createdAt: string;
  updatedAt?: string;
}
