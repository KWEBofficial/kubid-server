import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';
import CreateProductDTO from '../type/product/createproduct.dto';
import UserService from './user.service';
import { InternalServerError } from '../util/customErrors';
export default class ProductService {
  //상품 등록하기
  static async createProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const user = await UserService.getUserById(productData.user_id);
      if (!user) {
        throw new Error('해당 ID의 사용자가 존재하지 않습니다.');
      }

      const CreateProductDAO = {
        department: user.department,
        user: user,
        productName: productData.productName,
        desc: productData.desc,
        upperBound: productData.upperBound,
        lowerBound: productData.lowerBound,
        imageId: productData.imageId,
        tradingPlace: productData.tradingPlace,
        tradingTime: productData.tradingTime,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
        status: productData.status,
      };
      console.log(CreateProductDAO);

      const product = ProductRepository.create(CreateProductDAO);
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
