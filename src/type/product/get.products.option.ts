export interface GetProductsOption {
  search?: string;
  isRecentOrdered?: boolean;
  page?: number;
  limit?: number;
  departmentId?: number;
}

export interface GetPopularProductsOption {
  search?: string;
  departmentId?: number;
  page?: number;
  limit?: number;
}
