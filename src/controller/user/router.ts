import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import {
  getUser,
  updateUser,
  getSellingProducts,
  getBuyingProducts,
} from './controller';

const userRouter = Router();

userRouter.get('/current-user', decodeToken, getUser);
userRouter.patch('/current-user', decodeToken, updateUser);
userRouter.get('/current-user/product/sell', decodeToken, getSellingProducts);
userRouter.get('/current-user/product/buy', decodeToken, getBuyingProducts);

export default userRouter;
