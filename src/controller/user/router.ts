import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import {
  getUser,
  updateUserPassword,
  updateUserNickname,
  updateUserImage,
  getSellingProducts,
  getBuyingProducts,
} from './controller';

const userRouter = Router();

userRouter.get('/current-user', decodeToken, getUser);
userRouter.patch('/current-user/password', decodeToken, updateUserPassword);
userRouter.patch('/current-user/nickname', decodeToken, updateUserNickname);
userRouter.patch('/current-user/image', decodeToken, updateUserImage);
userRouter.get('/current-user/product/sell', decodeToken, getSellingProducts);
userRouter.get('/current-user/product/buy', decodeToken, getBuyingProducts);

export default userRouter;
