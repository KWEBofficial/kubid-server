import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import { getUser, getSellingProducts } from './controller';

const userRouter = Router();

userRouter.get('/current-user', decodeToken, getUser); // 현재 로그인 유저 정보
userRouter.get('/current-user/product/sell', decodeToken, getSellingProducts);

export default userRouter;
