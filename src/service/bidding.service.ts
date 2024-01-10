import Bidding from '../entity/bidding.entity';
import BiddingRepository from '../repository/bidding.repository';
import { InternalServerError } from '../util/customErrors';

export default class BiddingService {
  static async getHighestPriceByProductId(productId: number): Promise<number> {
    try {
      const bid = await BiddingRepository.createQueryBuilder('bidding')
        .select('MAX(bidding.price)', 'highestPrice')
        .where('bidding.product_id = :productId', { productId })
        .getRawOne();

      if (!bid)
        throw new InternalServerError('현재 최고입찰가를 찾지 못했어요.');

      return bid.highestPrice;
    } catch (error) {
      throw new InternalServerError('상품 목록을 불러오는데 실패했어요.');
    }
  }
  static async getBiddingsByProductId(productId: number): Promise<Bidding[]> {
    try {
      return await BiddingRepository.find({
        where: {
          product: {
            id: productId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerError('상품의 입찰 내역을 불러오지 못했어요.');
    }
  }
}
