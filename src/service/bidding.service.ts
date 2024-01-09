import BiddingRepository from '../repository/bidding.repository';
import { InternalServerError } from '../util/customErrors';

export default class BiddingService {
  static async getHighestPriceByProductId(productId: number): Promise<number> {
    try {
      const bid = await BiddingRepository.createQueryBuilder('bidding')
        .select('MAX(bidding.price)', 'highestPrice')
        .where('bidding.product_id = :productId', { productId })
        .getRawOne();

      return bid.highestPrice;
    } catch (error) {
      throw new InternalServerError('상품 최고 입찰가를 불러오지 못했어요.');
    }
  }
}
