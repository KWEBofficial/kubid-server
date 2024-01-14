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
  #swagger.summary = '현재 로그인 유저 정보';
  #swagger.parameters['Authorization'] = {
    in: 'header',
    required: false,
    type: 'string',
  };
  #swagger.responses[200] = {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CurrentUserResDTO',
        },
      },
    },
  };
  #swagger.security = [
    {
      bearerAuth: [],
    },
  ];
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

export const updateUserPassword: RequestHandler = async (req, res, next) => {
  /*
  #swagger.tags = ['User'];
  #swagger.summary = '현재 로그인 유저 정보 수정';
  #swagger.parameters['Authorization'] = {
    in: 'header',
    required: false,
    type: 'string',
  };
  #swagger.requestBody = {
    required: false,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CurrentUserUpdateReqDTO',
        },
      },
    },
  };
  #swagger.responses[200] = {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CurrentUserUpdateResDTO',
        },
      },
    },
  };
  #swagger.security = [
    {
      bearerAuth: [],
    },
  ];
  */
  try {
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const { password } = req.body as UpdateUserDTO;
    if (!password)
      throw new BadRequestError('새로운 비밀번호를 입력해 주세요.');

    const hashedPassword = await generateHashedPassword(password);
    const updateUserDTO: UpdateUserDTO = {
      password: hashedPassword,
    };

    const { email, department, createdAt, nickname } =
      await UserService.updateUser(userId, updateUserDTO);

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
    required: true,                     
    type: "string",                       
  };
  #swagger.responses[200] = {
    description: '상품의 입찰 내역이 없을 경우 `currentHighestPrice`는 `null`이 됩니다.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CurrentProductSellResDTO',
        },
      },
    },
  };
  #swagger.security = [
    {
      bearerAuth: [],
    },
  ];
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
      const maxPrice = await BiddingService.getHighestPriceByProductId(
        product.id,
      );
      userResponse.push({
        id: product.id,
        productName: product.productName,
        userId: product.user.id,
        status: product.status,
        currentHighestPrice: maxPrice,
        upper_bound: product.upperBound,
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

export const getBuyingProducts: RequestHandler = async (req, res, next) => {
  /*
  #swagger.tags = ['User'];
  #swagger.summary = "현재 구매 중인 상품 목록";
  #swagger.description = "현재 로그인 유저가 가장 최근에 입찰을 넣은 상품 순서대로 반환합니다."
  #swagger.parameters['Authorization'] = {
    in: 'header',                                     
    required: true,                     
    type: "string",                       
  };
  #swagger.parameters['page'] = {
    in: 'query',                                     
    required: true,                     
    type: "number",
    description: "페이지 번호 ex) 1",                       
  };
  #swagger.parameters['pageSize'] = {
    in: 'query',                                     
    required: true,                     
    type: "number",
    description: "페이지당 상품 개수 ex) 5",                       
  };
  #swagger.responses[200] = {
    content: {
      "application/json": {
        schema:{
          $ref: "#/components/schemas/CurrentProductBuyResDTO"
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

    const { page: pageAsString, pageSize: pageSizeAsString } = req.query;
    const page = Number(pageAsString);
    const pageSize = Number(pageSizeAsString);
    if (!page || !pageSize)
      throw new BadRequestError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const userResponse = [];
    const products = await ProductService.getBuyingProductsByUserId(
      userId,
      page,
      pageSize,
    );
    for (const product of products) {
      const current_highest_price =
        await BiddingService.getHighestPriceByProductId(product.id);

      userResponse.push({ ...product, current_highest_price });
    }
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};
