import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import { generateHashedPassword } from '../../util/authentication';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const password: string = req.body.password;
    if (!password) throw new BadRequestError('비밀번호를 입력하지 않았습니다.');

    const hashedPassword: string = await generateHashedPassword(password);
    res.send(hashedPassword);
  } catch (error) {
    next(error);
  }
};
