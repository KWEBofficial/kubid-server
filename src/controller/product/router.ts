import { Router } from 'express';
import { getAllProducts } from './controller';
import { createProduct } from './controller';

const productRouter = Router();

productRouter.get('', getAllProducts);
productRouter.post('', createProduct);

export default productRouter;
