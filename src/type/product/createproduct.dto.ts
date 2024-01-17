export enum Status {
  Progress = 'progress',
  Complete = 'complete',
}

export default interface CreateProductDTO {
  user_id: number;
  department_id: number;
  productName: string;
  desc: string;
  upperBound: number;
  lowerBound: number;
  imageId: number;
  tags: string[];
  tradeLocation: string;
  tradeDate: string;
  createdAt: string;
  updatedAt?: string;
  status: Status;
}
