import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';
import { Like } from 'typeorm';
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
  //모든 상품 조회
  static async getAllProducts(): Promise<Product[]> {
    try {
      return await ProductRepository.find({
        relations: ['user', 'department'],
      });
    } catch (error) {
      throw new InternalServerError('상품 목록을 불러오는데 실패했어요.');
    }
  }

  //페이징
  static async findProducts(page: number, limit: number): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return ProductRepository.find({
      skip: skip,
      take: limit,
    });
  }

  // 상품 검색
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    return ProductRepository.find({
      where: {
        productName: Like(`%${searchTerm}%`),
      },
    });
  }
}
