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

  static async getBuyingProductsByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<any[]> {
    try {
      const skip = (page - 1) * limit;
      const rawProducts = await ProductRepository.createQueryBuilder('product')
        .select([
          'product.id as id',
          'product.product_name',
          'product.user_id',
          'product.status as status',
          'MAX(bidding.price) as user_highest_price',
          'product.upper_bound',
          'product.image_id',
          'product.department_id',
          'product.created_at',
          'product.updated_at',
          'MAX(bidding.created_at) as user_bidding_last_created_at',
        ])
        .innerJoin('bidding', 'bidding', 'product.id = bidding.product_id')
        .where('bidding.user_id = :userId', { userId })
        .andWhere('product.status = :productStatus', {
          productStatus: 'progress',
        })
        .groupBy('product.id')
        .orderBy('user_bidding_last_created_at', 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany();

      const products = rawProducts.map((rawProduct) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user_bidding_last_created_at, ...product } = rawProduct;
        return product;
      });
      return products;
    } catch (error) {
      throw new InternalServerError(
        '유저가 구매 중인 상품의 입찰 내역을 불러오지 못했어요.',
      );
    }
  }
}
