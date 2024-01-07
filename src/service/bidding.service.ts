import Bidding from '../entity/bidding.entity';
import BiddingRepository from '../repository/bidding.repository';
import { InternalServerError } from '../util/customErrors';

export default class BiddingService {
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
