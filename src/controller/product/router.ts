import { Router } from 'express';

import { decodeToken } from '../auth/middleware';
import {
  getProducts,
  getProductDetail,
  updateProductDetail,
  deleteProduct,
  bidProduct,
  giveUpBidding,
  createProduct,
  countProducts,
  sellProduct,
} from './controller';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/count', countProducts);
productRouter.post('/', decodeToken, createProduct);
productRouter.post('/:productId/bidding', decodeToken, bidProduct);
productRouter.post('/bidding/give-up/:productId', decodeToken, giveUpBidding);
productRouter.post('/bidding/:productId', decodeToken, bidProduct);
productRouter.get('/:productId', getProductDetail);
productRouter.patch('/:productId', decodeToken, updateProductDetail);
productRouter.delete('/:productId', decodeToken, deleteProduct);
productRouter.post('/sell/:productId', decodeToken, sellProduct);

export default productRouter;
