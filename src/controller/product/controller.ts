import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';

import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';

// 검색어가 있으면 상품 검색, 검색어가 없으면 상품 전체 조회
export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const searchTerm = req.query.search as string;

    if (!searchTerm) {
      //검색어가 없을경우 : 전체 조회
      const products = await ProductService.getAllProducts();

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
    } else {
      //검색어가 있을 경우 : 전체조회
      const searchTerm = req.query.search as string;
      if (!searchTerm) {
        return res.status(400).json({ error: '검색어가 필요해요.' });
      }

      const products = await ProductService.searchProducts(searchTerm);
      res.json(products);
    }
  } catch (error) {
    next(error);
  }
};

/*
// 상품 검색
export const searchProducts: RequestHandler = async (req, res) => {
  try {
    const searchTerm = req.query.search as string;
    if (!searchTerm) {
      return res.status(400).json({ error: '검색어가 필요해요.' });
    }

    const products = await ProductService.searchProducts(searchTerm);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했어요.' });
  }
};
*/
