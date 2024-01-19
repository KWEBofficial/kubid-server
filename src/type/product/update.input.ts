export default interface UpdateProductDTO {
  productName: string;
  lowerBound: number;
  upperBound: number;
  imageId: number;
  desc: string;
  tradingPlace: string;
  tradingTime: string;
}
