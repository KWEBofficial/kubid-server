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
  departmentId: number;
  createdAt: string;
  updatedAt?: string;
}
