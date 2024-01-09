import { Router } from 'express';

import { getAllProducts } from './controller';
import { bidProduct, giveUpBidding } from './controller';
import { decodeToken } from '../auth/middleware';
import { createProduct } from './controller';

const productRouter = Router();

productRouter.get('', getAllProducts);
productRouter.post('', createProduct);
productRouter.post('/:productId/bidding', decodeToken, bidProduct);
productRouter.post('/bidding/give-up/:productId', decodeToken, giveUpBidding);
productRouter.post('/bidding/:productId', decodeToken, bidProduct);

export default productRouter;
