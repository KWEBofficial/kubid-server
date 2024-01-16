/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from '../entity/products.entity';
import ProductRepository from '../repository/product.repository';
import { Like } from 'typeorm';
import CreateProductDTO from '../type/product/createproduct.dto';
import UpdateProductDTO from '../type/product/update.input';
import UserService from './user.service';
import { InternalServerError } from '../util/customErrors';
import { Status } from '../type/product/createproduct.dto';
import {
  GetPopularProductsOption,
  GetProductsOption,
} from '../type/product/get.products.option';
import ImageService from './image.service';
import BiddingService from './bidding.service';
import { GetPopularProductsResult } from '../type/product/get.popular.products.result';

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
        status: Status.Progress,
      };
      console.log(CreateProductDAO);

      const product = ProductRepository.create(CreateProductDAO);
      return await ProductRepository.save(product);
    } catch (error) {
      throw new InternalServerError('상품을 등록하는데 실패했어요.');
    }
  }

  static async getProductByProductId(id: number): Promise<Product | null> {
    try {
      return await ProductRepository.findOne({
        where: { id },
        relations: ['image'],
      });
    } catch (error) {
      throw new InternalServerError('해당 상품을 찾지 못했어요.');
    }
  }

  static async updateProduct(
    productID: number,
    updateProductDTO: UpdateProductDTO,
  ): Promise<Product | null> {
    try {
      const image = await ImageService.getImageById(updateProductDTO.imageId);
      const { imageId, ...withoutImageId } = updateProductDTO;
      const updateProductDAO = {
        ...withoutImageId,
        image,
      };

      const updateResult = await ProductRepository.update(
        productID,
        updateProductDAO,
      );
      if (updateResult) {
        const updatedProduct = await ProductRepository.findOne({
          where: { id: productID },
          relations: ['image'],
        });
        return updatedProduct;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
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

  static async getProducts(option: GetProductsOption): Promise<Product[]> {
    try {
      const { search, isRecentOrdered, page, limit } = option;
      const skip =
        page !== undefined && limit !== undefined
          ? (page - 1) * limit
          : undefined;

      return await ProductRepository.find({
        where: search ? { productName: Like(`%${search}%`) } : undefined,
        relations: ['user', 'department', 'image'],
        skip: skip,
        take: limit,
        order: isRecentOrdered ? { createdAt: 'DESC' } : undefined,
      });
    } catch (error) {
      throw new InternalServerError('상품 목록을 조회하지 못했어요.');
    }
  }

  static async getPopularProducts(
    option: GetPopularProductsOption,
  ): Promise<GetPopularProductsResult[]> {
    try {
      const { search, departmentId, page, limit } = option;
      const skip =
        page !== undefined && limit !== undefined
          ? (page - 1) * limit
          : undefined;
      const queryBuilder = ProductRepository.createQueryBuilder('product')
        .select([
          'product.id as id',
          'product.product_name as productName',
          'product.user_id as userId',
          'product.status as status',
          'product.upper_bound as upperBound',
          'product.lower_bound as lowerBound',
          'product.image_id as imageId',
          'product.department_id as departmentId',
          'product.created_at as createdAt',
          'product.updated_at as updatedAt',
          'COUNT(DISTINCT bidding.user_id) as bidderCount',
        ])
        .innerJoin(
          'bidding',
          'bidding',
          'product.id = bidding.product_id AND status = :status',
          { status: Status.Progress },
        );

      if (departmentId !== undefined) {
        queryBuilder.innerJoin(
          'user',
          'user',
          'bidding.user_id = user.id AND user.department_id = :departmentId',
          { departmentId },
        );
      }

      if (search) {
        queryBuilder.where('product.product_name LIKE :name', {
          name: `%${search}%`,
        });
      }

      const products = await queryBuilder
        .groupBy('product.id')
        .orderBy('bidderCount', 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany();

      products.map(async (product) => {
        product.bidderCount = Number(product.bidderCount);
        if (departmentId !== undefined) {
          product.departmentBidderCount = product.bidderCount;
          product.bidderCount = await BiddingService.getBidderCountByProductId(
            product.id,
          );
        } else {
          product.departmentBidderCount = undefined;
        }
      });

      return products;
    } catch (error) {
      throw new InternalServerError('인기 상품 목록을 조회하지 못했어요.');
    }
  }

  static async getSellingProductsByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Product[]> {
    try {
      const skip = (page - 1) * limit;
      return await ProductRepository.find({
        where: {
          user: {
            id: userId,
          },
          status: 'progress',
        },
        relations: ['user', 'department', 'image'],
        skip: skip,
        take: limit,
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
