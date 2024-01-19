import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';
import TagService from '../../service/tag.service';
import UserService from '../../service/user.service';
import UpdateProductDTO from '../../type/product/update.input';
import CreateProductDTO from '../../type/product/createproduct.dto';
import errorHandler from '../../util/errorHandler';
import ImageService from '../../service/image.service';
import { ImageDTO } from '../../type/image/image.dto';
import { GetPopularProductsResult } from '../../type/product/get.popular.products.result';
import Product from '../../entity/products.entity';
import User from '../../entity/user.entity';
import DepartmentService from '../../service/department.service';

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
    const image = await ImageService.getImageById(product.image.id);
    const seller = await UserService.getUserByProductId(productId);
    const biddings = await BiddingService.getBiddingsByProductId(productId);
    if (!seller) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
    const department = await DepartmentService.getDepartmentById(seller.id);
    if (!department) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }
    res.status(200).json({
      id: product.id,
      productName: product.productName,
      upperBound: product.upperBound,
      currentHighestPrice: maxPrice,
      lowerBound: product.lowerBound,
      image: image,
      description: product.desc,
      tags: tagsById,
      tradeLocation: product.tradingPlace,
      tradeDate: product.tradingTime,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      department: department.departmentName,
      biddings: biddings,
      seller: seller,
      status: product.status,
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
    if (!updatedProduct)
      throw new InternalServerError('알 수 없는 에러가 발생했어요.');

    const image: ImageDTO = await ImageService.getImageById(
      updatedProduct.image.id,
    );

    const ret = {
      ...updatedProduct,
      image,
    };

    res.status(200).json(ret);
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
  /*
  #swagger.tags = ['Product'];
  #swagger.summary = "상품 조회 및 검색";
  #swagger.description = "그냥 상품 조회, 최근 상품 조회, 인기 상품 조회, 검색, 페이징 등을 쿼리로 조정해서 사용할 수 있습니다."
  #swagger.parameters['search'] = {
    in: 'query',                                     
    required: false,                     
    type: "string",
    description: "검색어",                       
  };
  #swagger.parameters['sort'] = {
    in: 'query',                                     
    required: false,                     
    type: "string",
    description: 'sort=recent: 최근, sort=popular: 인기 (현재 판매 중인 상품 중에서, 입찰자 많은 순으로), 이외: 정렬 없음 (상품 id 순)',                       
  };
  #swagger.parameters['departmentId'] = {
    in: 'query',                                     
    required: false,                     
    type: "number",
    description: 'sort=popular일 때와 아닐 때의 동작이 다른 것에 주의 ex) sort=popular&departmentId=49: 컴퓨터학과 소속 입찰자가 많은 순으로, ex) sort=recent&departmentId=49: 컴퓨터학과 상품들을 최근 순으로'
  };
  #swagger.parameters['page'] = {
    in: 'query',                                     
    required: false,                     
    type: "number",
    description: "페이지 번호",                       
  };
  #swagger.parameters['pageSize'] = {
    in: 'query',                                     
    required: false,                     
    type: "number",
    description: "페이지당 상품 개수",                       
  };
  #swagger.responses[200] = {
    description: '해당하는 상품이 없을 경우 빈 배열 `[]`을 반환합니다. `bidderCount`는 `sort=popular`일 경우에만, `departmentBidderCount`는 `sort=popular&departmentId=?`일 때만 반환됩니다',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/GetProductsResDTO',
        },
      },
    },
  };
  */
  try {
    const { search, sort, page, pageSize, departmentId } = req.query;
    let products: Product[] | GetPopularProductsResult[];

    if (sort === 'popular') {
      products = await ProductService.getPopularProducts({
        search: search as string | undefined,
        departmentId:
          Number(departmentId) > 0 ? Number(departmentId) : undefined,
        page: Number(page) > 0 ? Number(page) : undefined,
        limit: Number(pageSize) > 0 ? Number(pageSize) : undefined,
      });
    } else {
      products = await ProductService.getProducts({
        search: search as string | undefined,
        isRecentOrdered: sort === 'recent',
        page: Number(page) > 0 ? Number(page) : undefined,
        limit: Number(pageSize) > 0 ? Number(pageSize) : undefined,
        departmentId:
          Number(departmentId) > 0 ? Number(departmentId) : undefined,
      });
    }

    const ret = await Promise.all(
      products.map(async (product: Product | GetPopularProductsResult) => {
        const currentHighestPrice =
          await BiddingService.getHighestPriceByProductId(product.id);
        const image = await ImageService.getImageById(
          'image' in product ? product.image.id : product.imageId,
        );

        return {
          id: product.id,
          productName: product.productName,
          userId: 'user' in product ? product.user.id : product.userId,
          status: product.status,
          bidderCount:
            'bidderCount' in product ? product.bidderCount : undefined,
          departmentBidderCount:
            'departmentBidderCount' in product
              ? product.departmentBidderCount
              : undefined,
          currentHighestPrice: currentHighestPrice,
          lowerBound: product.lowerBound,
          upperBound: product.upperBound,
          image: image,
          departmentId:
            'department' in product
              ? product.department.id
              : product.departmentId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      }),
    );

    res.json(ret);
  } catch (error) {
    next(error);
  }
};

export const countProducts: RequestHandler = async (req, res, next) => {
  /*
  #swagger.tags = ['Product'];
  #swagger.summary = "상품 검색 결과 개수 조회";
  #swagger.description = "조건에 해당하는 상품의 개수를 반환합니다."
  #swagger.parameters['search'] = {
    in: 'query',                                     
    required: false,                     
    type: "string",
    description: "검색어",                       
  };
  #swagger.parameters['departmentId'] = {
    in: 'query',                                     
    required: false,                     
    type: "number",
    description: '해당 학과의 상품만 검색'
  };
  #swagger.responses[200] = {
    description: '',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/GetProductsCountResDTO',
        },
      },
    },
  };
  */
  try {
    const { search, departmentId } = req.query;
    const count = await ProductService.countProducts({
      search: search !== undefined ? String(search) : '',
      departmentId: Number(departmentId) > 0 ? Number(departmentId) : undefined,
    });
    res.status(200).json({
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData: CreateProductDTO = req.body;

    const createdProduct = await ProductService.createProduct(productData);

    const createdTag = await TagService.createTag(
      createdProduct.id,
      req.body.tags,
    );

    return res.status(201).json(createdProduct && createdTag);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
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
