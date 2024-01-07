import { Router } from 'express';
import userRouter from './user/router';
import authRouter from './auth/router';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
