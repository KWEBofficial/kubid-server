import { Router } from 'express';
import { getDepartments } from './controller';

const departmentRouter = Router();

departmentRouter.get('/departments', getDepartments);

export default departmentRouter;
