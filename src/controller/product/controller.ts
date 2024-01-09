import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import TagService from '../../service/tag.service';
import UserService from '../../service/user.service';
import UpdateProductDTO from '../../type/product/update.input';

export const getProductDetail: RequestHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await ProductService.getProductByProductId(productId);
    if (!productId || !product) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
    const biddings = await BiddingService.getBiddingsByProductId(productId);
    const prices = biddings.map((bidding) => bidding.price);
    const maxPrice = Math.max(...prices);
    const tagsById = await TagService.getTagsById(productId);
    res.status(200).json({
      id: product.id,
      product_name: product.productName,
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
