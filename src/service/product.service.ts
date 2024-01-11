import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';
import { InternalServerError } from '../util/customErrors';
import UpdateProductDTO from '../type/product/update.input';

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

  static async updateProduct(
    productID: number,
    updateProductDTO: UpdateProductDTO,
  ): Promise<Product | null> {
    try {
      const UpdateProductDAO = updateProductDTO;
      const updateResult = await ProductRepository.update(
        productID,
        UpdateProductDAO,
      );
      if (updateResult) {
        const updatedProduct = await ProductRepository.findOne({
          where: { id: productID },
        });
        return updatedProduct;
      } else {
        return null;
      }
    } catch (error) {
      throw new InternalServerError('제품 정보를 수정하지 못했어요.');
    }
  }

  static async deleteProductByIds(
    userId: number,
    productId: number,
  ): Promise<void> {
    try {
      await ProductRepository.softDelete({
        id: productId,
        user: { id: userId },
      });
    } catch (error) {
      throw new InternalServerError('제품을 취소하지 못했어요.');
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
