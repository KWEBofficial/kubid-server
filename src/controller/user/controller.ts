import { RequestHandler } from 'express';
import UserService from '../../service/user.service';
//import CreateUserInput from '../../type/user/create.input';
import { BadRequestError } from '../../util/customErrors';

// 예시 controller입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.query.id);

    const user = await UserService.getUserById(id);
    if (!user) throw new BadRequestError('해당하는 유저가 없습니다.');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail: RequestHandler = async (req, res, next) => {
  try {
    const email = String(req.query.email);

    const user = await UserService.getUserByEmail(email);
    if (!user) throw new BadRequestError('해당하는 유저가 없습니다.');

    res.json(user);
  } catch (error) {
    next(error);
  }
};
/*
export const getUsersByAge: RequestHandler = async (req, res, next) => {
  try {
    const age = Number(req.params.age);

    const users = await UserService.getUsersByAge(age);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, age } = req.body as CreateUserInput;
    const createUserInput: CreateUserInput = { firstName, lastName, age };

    const user = await UserService.saveUser(createUserInput);

    res.status(201).json(user.id);
  } catch (error) {
    next(error);
  }
};
*/
