import { Router } from 'express';
import userRouter from './user/router';
import authRouter from './auth/router';
import productRouter from './product/router';
import tagRouter from './tag/router';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/tags', tagRouter);

export default router;
