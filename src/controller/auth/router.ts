import { Router } from 'express';
import { validatePassword, hashPassword } from './controller';

const authRouter = Router();

authRouter.post('/register', validatePassword, hashPassword);

export default authRouter;
