import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import CreateProductDTO from '../../type/product/createproduct.dto';

import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import errorHandler from '../../util/errorHandler';

export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();

    const ret = await Promise.all(
      products.map(async (product) => {
        const currentHighestPrice =
          await BiddingService.getHighestPriceByProductId(product.id);
        return {
          id: product.id,
          productName: product.productName,
          user_id: product.user.id,
          status: product.status,
          currentHighestPrice: currentHighestPrice,
          upperBound: product.upperBound,
          imageId: product.imageId,
          departmentId: product.department.id,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      }),
    );

    if (!products || !ret)
      throw new BadRequestError('정보를 불러오는데 실패했어요.');

    res.json(ret);
  } catch (error) {
    next(error);
  }
};

//상품 등록하기
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData: CreateProductDTO = req.body;
    const createdProduct = await ProductService.createProduct(productData);
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ error: '문제가 발생했어요.' });
  }
};

export const bidProduct: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) throw new BadRequestError('로그인이 필요합니다.');

    const productId = Number(req.params.productId);
    if (!productId) throw new BadRequestError('상품 아이디를 확인해주세요.');

    const price = Number(req.body.biddingPrice);
    if (!price) throw new BadRequestError('입찰 가격을 확인해주세요.');

    const bidding = await BiddingService.bidProductByIds(
      userId,
      productId,
      price,
    );

    res.status(201).json({ bidding });
  } catch (error) {
    next();
  }
};

export const giveUpBidding: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) throw new BadRequestError('로그인이 필요합니다.');

    const productId = Number(req.params.productId);
    if (!productId) throw new BadRequestError('상품 아이디를 확인해주세요.');

    await BiddingService.giveUpBiddingByIds(userId, productId);

    res.status(204).end();
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
