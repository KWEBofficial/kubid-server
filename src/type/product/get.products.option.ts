export interface GetProductsOption {
  search?: string;
  isRecentOrdered?: boolean;
  page?: number;
  limit?: number;
}

export interface GetPopularProductsOption {
  search?: string;
  page?: number;
  limit?: number;
}
