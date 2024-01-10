export default interface CreateProductDTO {
  productName: string;
  desc: string;
  upperBound: number;
  lowerBound: number;
  imageId: number;
  tags: string[];
  tradingPlace: string;
  tradingTime: string;
  createdAt: string;
  updatedAt?: string;
}
