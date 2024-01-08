import { Router } from 'express';
import { getAllProducts } from './controller';

const productRouter = Router();

productRouter.get('',getAllProducts);

export default productRouter;
