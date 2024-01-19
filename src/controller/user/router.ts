import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import {
  getUser,
  getSellingProducts,
  getSoldProducts,
  getBuyingProducts,
  updateUserDetails,
} from './controller';

const userRouter = Router();

userRouter.get('/current-user', decodeToken, getUser);
userRouter.patch('/current-user', decodeToken, updateUserDetails);
userRouter.get('/current-user/product/sell', decodeToken, getSellingProducts);
userRouter.get('/current-user/product/sold', decodeToken, getSoldProducts);
userRouter.get('/current-user/product/buy', decodeToken, getBuyingProducts);

export default userRouter;
