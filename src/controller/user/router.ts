import { Router } from 'express';
import { updateUser } from './controller';
import { authRequired } from '../auth/middleware';

const userRouter = Router();

userRouter.patch('/current-user', authRequired, updateUser);

export default userRouter;
