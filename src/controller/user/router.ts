import { Router } from 'express';
import { getSellingProducts } from './controller';
import { authRequired } from '../auth/middleware';

const userRouter = Router();

userRouter.get('/current-user/product/sell', authRequired, getSellingProducts);

export default userRouter;
