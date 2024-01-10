import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import UpdateUserDTO from '../../type/user/update.input';
import UserService from '../../service/user.service';
import { generateHashedPassword } from '../../util/authentication';

export const getUser: RequestHandler = async (req, res, next) => {
  /*
  #swagger.auto = false;
  #swagger.tags = ['User'];
  #swagger.summary = "현재 로그인 유저 정보";
  #swagger.parameters['Authorization'] = {
    in: 'header',                                     
    required: true,                     
    type: "string",                       
  };
  #swagger.responses[201] = {
    content: {
      "application/json": {
        schema:{
          $ref: "#/components/schemas/CurrentUserResDTO"
        }
      }           
    }
  };
  #swagger.security = [{
            "bearerAuth": []
  }];
  */

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
  /*
  #swagger.tags = ['User'];
  #swagger.summary = "현재 로그인 유저 정보 수정";
  #swagger.parameters['Authorization'] = {
    in: 'header',                                     
    required: true,                     
    type: "string",                       
  };
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
            $ref: "#/components/schemas/CurrentUserUpdateReqDTO"
        }
      }
    }
  };
  #swagger.responses[200] = {
    content: {
      "application/json": {
        schema:{
          $ref: "#/components/schemas/CurrentUserUpdateResDTO"
        }
      }           
    }
  };
  #swagger.security = [{
            "bearerAuth": []
  }];
  */
  try {
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const { password, nickname } = req.body as UpdateUserDTO;
    if (!password) throw new BadRequestError('비밀번호를 입력해 주세요.');
    if (!nickname) throw new BadRequestError('닉네임을 입력해 주세요.');

    const hashedPassword = await generateHashedPassword(password);
    const updateUserDTO: UpdateUserDTO = { password: hashedPassword, nickname };

    const { email, department, createdAt } = await UserService.updateUser(
      userId,
      updateUserDTO,
    );

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
  /*
  #swagger.tags = ['User'];
  #swagger.summary = "현재 판매 중인 상품 목록";
  #swagger.parameters['Authorization'] = {
    in: 'header',                                     
    required: false,                     
    type: "string",                       
  };
  #swagger.responses[200] = {
    content: {
      "application/json": {
        schema:{
          $ref: "#/components/schemas/CurrentProductSellResDTO"
        }
      }           
    }
  };
  #swagger.security = [{
            "bearerAuth": []
  }];
  */
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
