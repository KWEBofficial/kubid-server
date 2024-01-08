import { Router } from 'express';
import userRouter from './user/router';
import authRouter from './auth/router';
import productRouter from './product/router';

const router = Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);

export default router;
