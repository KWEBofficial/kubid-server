import { Router } from 'express';
//import { getUserByEmail } from './controller';
//import { createUser, getUserById, getUsersByAge } from './controller';

const userRouter = Router();

/*
userRouter.get('/', getUserByEmail); // query를 사용하여 email에 맞는 user 정보를 가져오는 api ex) GET http://localhost:3000/user?email="name@example.com"
userRouter.get('/:age', getUsersByAge); // param을 사용하여 age에 맞는 user들 정보를 가져오는 api ex) GET http://localhost:3000/user/23
userRouter.post('/', createUser); // body를 사용하여 user 정보를 저장하는 api ex) POST http://localhost:3000/user | body: { "firstName": "John", "lastName": "Doe", "age": 23 }
*/
export default userRouter;
