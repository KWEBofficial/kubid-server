import { Router } from 'express';
import { signup } from './controller';

const authRouter = Router();

authRouter.post('/sign-up', signup);

export default authRouter;
