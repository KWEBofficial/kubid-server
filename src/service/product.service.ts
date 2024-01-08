import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';
import { InternalServerError } from '../util/customErrors';

export default class ProductService {
  static async getSellingProductsByUserId(userId: number): Promise<Product[]> {
    try {
      return await ProductRepository.find({
        where: {
          user: {
            id: userId,
          },
          status: 'progress',
        },
        relations: ['user', 'department'],
      });
    } catch (error) {
      throw new InternalServerError(
        '현재 판매 중인 상품 목록을 불러오지 못했어요.',
      );
    }
  }

  static async getProductByProductId(id: number): Promise<Product | null> {
    try {
      return await ProductRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('해당 상품을 찾지 못했어요.');
    }
  }
}
