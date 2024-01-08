import { RequestHandler } from 'express';
import { InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import TagService from '../../service/tag.service';

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
