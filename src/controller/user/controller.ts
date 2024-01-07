import { RequestHandler } from 'express';
import { InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
//import CreateUserInput from '../../type/user/create.input';

export const getSellingProducts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = req.user as any;
    const userResponse = [];

    const products = await ProductService.getSellingProductsByUserId(id);
    for (const product of products) {
      const biddings = await BiddingService.getBiddingsByProductId(product.id);
      const prices = biddings.map((bidding) => bidding.price);
      const maxPrice = Math.max(...prices);
      userResponse.push({
        id: product.id,
        product_name: product.productName,
        user_id: product.user.id,
        status: product.status,
        currentHighestPrice: maxPrice,
        upperBound: product.upperBound,
        imageId: product.imageId,
        departmentId: product.department.id,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};
