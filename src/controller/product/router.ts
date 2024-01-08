import { Router } from 'express';

import { getAllProducts } from './controller';
import { bidProduct } from './controller';
import { decodeToken } from '../auth/middleware';

const productRouter = Router();

productRouter.get('', getAllProducts);
productRouter.post('/:productId/bidding', decodeToken, bidProduct);

export default productRouter;
