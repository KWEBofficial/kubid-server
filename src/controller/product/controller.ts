import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import { ProductDTO } from '../../type/product/product.dto';

import ProductService from '../../service/product.service';
import BiddingService from '../../service/bidding.service';

export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();

    const ret = await Promise.all(
      products.map(async (product) => {
        const currentHighestPrice =
          await BiddingService.getHighestPriceByProductId(product.id);
        return {
          id: product.id,
          productName: product.productName,
          user_id: product.user.id,
          departmentId: product.department.id,
          status: product.status,
          currentHighestPrice: currentHighestPrice,
          upperBound: product.upperBound,
          imageId: product.imageId,
          tradeLocation: product.tradingPlace,
          tradeDate: product.tradingTime,
        };
      }),
    );

    if (!products || !ret)
      throw new BadRequestError('정보를 불러오는데 실패했어요.');

    res.json(ret);
  } catch (error) {
    next(error);
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData: ProductDTO = req.body;
    const createdProduct = await ProductService.createProduct(productData);
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ error: '문제가 발생했어요.' });
  }
};
