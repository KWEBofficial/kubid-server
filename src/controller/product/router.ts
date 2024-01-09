import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import { getProductDetail, updateProductDetail, deleteProduct } from './controller';

const productRouter = Router();

productRouter.get('/:productId', getProductDetail);
productRouter.patch('/:productId', decodeToken, updateProductDetail);
productRouter.delete('/:productId', decodeToken, deleteProduct);

export default productRouter;
