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
userRouter.put('/current-user/password', decodeToken, updateUserPassword);
userRouter.put('/current-user/nickname', decodeToken, updateUserNickname);
userRouter.put('/current-user/image', decodeToken, updateUserImage);
userRouter.get('/current-user/product/sell', decodeToken, getSellingProducts);
userRouter.get('/current-user/product/buy', decodeToken, getBuyingProducts);

export default userRouter;
