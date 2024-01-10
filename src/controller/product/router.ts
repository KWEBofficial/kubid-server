import { Router } from 'express';
import { getProducts } from './controller';

const productRouter = Router();

productRouter.get('', getProducts);

export default productRouter;
