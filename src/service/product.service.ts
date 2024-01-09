import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';

import { ProductDTO } from '../type/product/product.dto';
import { InternalServerError } from '../util/customErrors';
export default class ProductService {
  //상품 등록하기
  static async createProduct(productData: ProductDTO): Promise<Product> {
    try {
      const productDAO = {
        id: productData.id,
        product_name: productData.product_name,
        user_id: productData.user_id,
        status: productData.status,
        currentHighestPrice: productData.currentHighestPrice,
        upperBound: productData.upperBound,
        imageId: productData.imageId,
        departmentId: productData.departmentId,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      };
      const product = ProductRepository.create(productDAO);
      return await ProductRepository.save(product);
    } catch (error) {
      throw new InternalServerError('상품을 등록하는데 실패했어요.');
    }
  }

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
  //모든 상품 찾기
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
}
/*
data: {
    productName: string;
    userId: number;
    desc: string;
    status: Status;
    lowerBound: number;
    upperBound: number;
    imageId: number;
    tradingPlace: string;
    tradingTime: string;
    department_id: string;
  }
*/
