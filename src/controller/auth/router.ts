import { Router } from 'express';
import { signIn } from './controller';

const authRouter = Router();

authRouter.post('/sign-in', signIn);

export default authRouter;
