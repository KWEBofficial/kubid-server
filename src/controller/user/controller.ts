import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import UpdateUserDTO from '../../type/user/update.input';
import UserService from '../../service/user.service';
import User from '../../entity/user.entity';
import { generateHashedPassword } from '../../util/authentication';

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

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const { password, nickname } = req.body as UpdateUserDTO;
    if (!password) throw new BadRequestError('비밀번호를 입력해 주세요.');
    if (!nickname) throw new BadRequestError('닉네임을 입력해 주세요.');

    const hashedPassword: string = await generateHashedPassword(password);
    const updateUserDTO: UpdateUserDTO = { password: hashedPassword, nickname };

    const userAffected = await UserService.updateUser(userId, updateUserDTO);
    if (!userAffected)
      throw new InternalServerError('유저 정보를 수정하지 못했어요.');

    const { email, department, createdAt } = (await UserService.getUserById(
      userId,
    )) as User;
    const userResponse = {
      userId,
      email,
      nickname,
      departmentId: department.id,
      createdAt,
    };
    res.status(200).json(userResponse);
    return;
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
      const tags = await 
      userResponse.push({
        id: product.id,
        product_name: product.productName,
        upper_bound: product.upperBound,
        currentHighestPrice: maxPrice,
        imageId: product.imageId,

        user_id: product.user.id,
        status: product.status,
        
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
