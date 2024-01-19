export interface GetPopularProductsResult {
  id: number;
  productName: string;
  userId: number;
  status: 'progress' | 'complete';
  upperBound: number;
  lowerBound: number;
  imageId: number;
  departmentId: number;
  createdAt: Date;
  updatedAt: Date;
  bidderCount: number;
  departmentBidderCount?: number;
}
