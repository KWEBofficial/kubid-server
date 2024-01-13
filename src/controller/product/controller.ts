import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import TagService from '../../service/tag.service';
import UserService from '../../service/user.service';
import UpdateProductDTO from '../../type/product/update.input';
import CreateProductDTO from '../../type/product/createproduct.dto';
import errorHandler from '../../util/errorHandler';

export const getProductDetail: RequestHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await ProductService.getProductByProductId(productId);
    if (!productId || !product) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
    const maxPrice = await BiddingService.getHighestPriceByProductId(productId);
    const tagsById = await TagService.getTagsById(productId);
    res.status(200).json({
      id: product.id,
      productName: product.productName,
      upperBound: product.upperBound,
      currentHighestPrice: maxPrice,
      imageId: product.imageId,
      desciption: product.desc,
      tags: tagsById,
      tradeLocation: product.tradingPlace,
      tradeDate: product.tradingTime,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductDetail: RequestHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await ProductService.getProductByProductId(productId);
    if (!productId || !product) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    // 로그인한 사용자와 글을 작성한 사용자가 같은지 확인
    const user = await UserService.getUserByProductId(productId);
    if (!user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    if (user.id !== userId)
      throw new BadRequestError('판매자만 글을 수정할 수 있어요.');
    /* 수정할 수 있는 정보
  product_name: string;
  upperBound: number;
  imageId: number;
  desciption: string;
  tradeLocation: string;
  tradeDate: string;
    */
    const {
      productName,
      upperBound,
      imageId,
      desc,
      tradingPlace,
      tradingTime,
    } = req.body as UpdateProductDTO;

    // 입력 필수 사항을 확인합니다.
    if (!productName) throw new BadRequestError('상품 이름을 입력해 주세요.');
    if (!upperBound)
      throw new BadRequestError('상품의 상한가를 입력해 주세요.');
    if (!imageId) throw new BadRequestError('상품의 이미지를 입력해 주세요.');
    if (!desc) throw new BadRequestError('상품의 상세 설명을 입력해 주세요.');
    if (!tradingPlace)
      throw new BadRequestError('상품의 희망 거래장소를 입력해 주세요.');
    if (!tradingTime)
      throw new BadRequestError('상품의 희망 거래일시를 입력해 주세요.');

    const updateProductDTO: UpdateProductDTO = {
      productName,
      upperBound,
      imageId,
      desc,
      tradingPlace,
      tradingTime,
    };
    const updatedProduct = await ProductService.updateProduct(
      productId,
      updateProductDTO,
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await ProductService.getProductByProductId(productId);
    if (!productId || !product) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    // 로그인한 사용자와 글을 작성한 사용자가 같은지 확인
    const user = await UserService.getUserByProductId(productId);
    if (!user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    if (user.id !== userId)
      throw new BadRequestError('판매자만 글을 삭제할 수 있어요.');

    await ProductService.deleteProductByIds(userId, productId);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const { search, sort, page, pageSize } = req.query;
    const products = await ProductService.getProducts({
      search: search as string | undefined,
      isRecentOrdered: sort === 'recent',
      page: Number(page) > 0 ? Number(page) : undefined,
      limit: Number(pageSize) > 0 ? Number(pageSize) : undefined,
    });

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
          lowerBound: product.lowerBound,
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
