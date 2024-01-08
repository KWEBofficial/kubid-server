import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';

import { InternalServerError } from '../util/customErrors';
//import DepartmentService from './department.service';

export default class ProductService {
  //모든 상품 찾기
  static async getAllProducts(): Promise<Product[]> {
    try {
      return await ProductRepository.find({});
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
