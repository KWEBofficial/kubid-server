import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import { getProductDetail, updateProductDetail } from './controller';

const productRouter = Router();

productRouter.get('/:productId', getProductDetail);
productRouter.patch('/:productId', decodeToken, updateProductDetail);

export default productRouter;
