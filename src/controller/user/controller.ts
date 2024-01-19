import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import {
  UpdateUserPasswordDTO,
  UpdateUserProfileImageDTO,
} from '../../type/user/update.input';
import { UpdateUserNicknameDTO } from '../../type/user/update.input';
import UserService from '../../service/user.service';
import { generateHashedPassword } from '../../util/authentication';
import ImageService from '../../service/image.service';

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
    res.status(200).json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      departmentId: user.department.id,
      createdAt: user.createdAt,
      image: user.image,
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

    const { password } = req.body as UpdateUserPasswordDTO;
    if (!password)
      throw new BadRequestError('새로운 비밀번호를 입력해 주세요.');

    const hashedPassword = await generateHashedPassword(password);
    const UpdateUserPasswordDTO: UpdateUserPasswordDTO = {
      password: hashedPassword,
    };

    const { email, department, createdAt, nickname } =
      await UserService.updateUserPassword(userId, UpdateUserPasswordDTO);

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

export const updateUserNickname: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const { nickname } = req.body as UpdateUserNicknameDTO;
    if (!nickname) throw new BadRequestError('새로운 닉네임을 입력해주세요.');
    const UpdateUserNicknameDTO: UpdateUserNicknameDTO = {
      nickname: nickname,
    };
    const { email, department, createdAt, password } =
      await UserService.updateUserNickname(userId, UpdateUserNicknameDTO);

    const userResponse = {
      userId,
      email,
      password,
      departmentId: department.id,
      createdAt,
    };
    res.status(200).json(userResponse);
    return;
  } catch (error) {
    next(error);
  }
};
export const updateUserImage: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const { image } = req.body as UpdateUserProfileImageDTO;
    if (!image) throw new BadRequestError('새로운 사진을 업로드해주세요.');
    const UpdateUserProfileImageDTO: UpdateUserProfileImageDTO = {
      image: image,
    };
    const { email, department, createdAt, password } =
      await UserService.updateUserImage(userId, UpdateUserProfileImageDTO);

    const userResponse = {
      userId,
      email,
      password,
      departmentId: department.id,
      createdAt,
    };
    res.status(200).json(userResponse);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails: RequestHandler = async (req, res, next) => {
  try {
    // Example: req.body may contain fields like { password, nickname, image }
    if (req.body.password) {
      // update password logic
      try {
        const userId = req.userId;
        if (!userId)
          throw new InternalServerError(
            '일시적인 오류가 발생했어요. 다시 시도해주세요.',
          );

        const { password } = req.body as UpdateUserPasswordDTO;
        if (!password)
          throw new BadRequestError('새로운 비밀번호를 입력해 주세요.');

        const hashedPassword = await generateHashedPassword(password);
        const UpdateUserPasswordDTO: UpdateUserPasswordDTO = {
          password: hashedPassword,
        };

        const { email, department, createdAt, nickname } =
          await UserService.updateUserPassword(userId, UpdateUserPasswordDTO);

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
    }
    if (req.body.nickname) {
      // update nickname logic
      try {
        const userId = req.userId;
        if (!userId)
          throw new InternalServerError(
            '일시적인 오류가 발생했어요. 다시 시도해주세요.',
          );

        const { nickname } = req.body as UpdateUserNicknameDTO;
        if (!nickname)
          throw new BadRequestError('새로운 닉네임을 입력해주세요.');
        const UpdateUserNicknameDTO: UpdateUserNicknameDTO = {
          nickname: nickname,
        };
        const { email, department, createdAt, password } =
          await UserService.updateUserNickname(userId, UpdateUserNicknameDTO);

        const userResponse = {
          userId,
          email,
          password,
          departmentId: department.id,
          createdAt,
        };
        res.status(200).json(userResponse);
        return;
      } catch (error) {
        next(error);
      }
    }
    if (req.body.image) {
      // update image logic
      try {
        const userId = req.userId;
        if (!userId)
          throw new InternalServerError(
            '일시적인 오류가 발생했어요. 다시 시도해주세요.',
          );

        const { image } = req.body as UpdateUserProfileImageDTO;
        if (!image) throw new BadRequestError('새로운 사진을 업로드해주세요.');
        const UpdateUserProfileImageDTO: UpdateUserProfileImageDTO = {
          image: image,
        };
        const { email, department, createdAt, password } =
          await UserService.updateUserImage(userId, UpdateUserProfileImageDTO);

        const userResponse = {
          userId,
          email,
          password,
          departmentId: department.id,
          createdAt,
        };
        res.status(200).json(userResponse);
        return;
      } catch (error) {
        next(error);
      }
    }
    // ... respond with appropriate status and message
  } catch (error) {
    // ... error handling
  }
};

export const getSellingProducts: RequestHandler = async (req, res, next) => {
  /*
  #swagger.tags = ['User'];
  #swagger.summary = "현재 판매 중인 상품 목록";
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

    const { page: pageAsString, pageSize: pageSizeAsString } = req.query;
    const page = Number(pageAsString);
    const pageSize = Number(pageSizeAsString);
    if (!page || !pageSize)
      throw new BadRequestError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );

    const userResponse = [];
    const products = await ProductService.getSellingProductsByUserId(
      userId,
      page,
      pageSize,
    );
    for (const product of products) {
      const maxPrice = await BiddingService.getHighestPriceByProductId(
        product.id,
      );
      // 추가: bidderCount 구하기
      const bidderCount = await BiddingService.getBidderCountByProductId(
        product.id,
      );
      userResponse.push({
        id: product.id,
        productName: product.productName,
        user_id: product.user.id,
        status: product.status,
        lowerBound: product.lowerBound,
        upperBound: product.upperBound,
        department_id: product.department.id,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
        currentHighestPrice: maxPrice,
        image: product.image,
        bidderCount: bidderCount, // bidderCount 추가
      });
    }
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const getSoldProducts: RequestHandler = async (req, res, next) => {
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
    const products = await ProductService.getSoldProductsByUserId(
      userId,
      page,
      pageSize,
    );
    for (const product of products) {
      const maxPrice = await BiddingService.getHighestPriceByProductId(
        product.id,
      );
      // 추가: bidderCount 구하기
      const bidderCount = await BiddingService.getBidderCountByProductId(
        product.id,
      );
      userResponse.push({
        id: product.id,
        productName: product.productName,
        user_id: product.user.id,
        status: product.status,
        lowerBound: product.lowerBound,
        upperBound: product.upperBound,
        department_id: product.department.id,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
        currentHighestPrice: maxPrice,
        image: product.image,
        bidderCount: bidderCount, // bidderCount 추가
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
      const currentHighestPrice =
        await BiddingService.getHighestPriceByProductId(product.id);

      // 추가: bidderCount 구하기
      const bidderCount = await BiddingService.getBidderCountByProductId(
        product.id,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image_id, ...productWithoutImageId } = product;

      userResponse.push({
        ...productWithoutImageId,
        currentHighestPrice,
        image: await ImageService.getImageById(image_id),
        bidderCount: bidderCount, // bidderCount 추가
      });
    }
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};
