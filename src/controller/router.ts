import { Router } from 'express';
import userRouter from './user/router';
import authRouter from './auth/router';
import productRouter from './product/router';
import tagRouter from './tag/router';
import imageRouter from './image/router';
import departmentRouter from './depeartment/router';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/tags', tagRouter);
router.use('/image', imageRouter);
router.use('/department', departmentRouter);

export default router;
