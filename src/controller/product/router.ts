import { Router } from 'express';
import { getAllProducts } from './controller';
import { searchProducts } from './controller';

const productRouter = Router();

productRouter.get('', getAllProducts);
productRouter.get('/search', searchProducts);
export default productRouter;
