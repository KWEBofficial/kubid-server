import { RequestHandler } from 'express';
import { InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import UserService from '../../service/user.service';
import { BadRequestError } from '../../util/customErrors';

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) throw new BadRequestError('temp');
    const user = await UserService.getUserById(userId);
    if (!user) throw new BadRequestError('등록되어 있지 않은 사용자에요!');
    res.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      departmentId: user.department,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellingProducts: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const userResponse = [];
    const products = await ProductService.getSellingProductsByUserId(userId);
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
