import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import { generateHashedPassword } from '../../util/authentication';

export const validatePassword: RequestHandler = (req, res, next) => {
  try {
    const password: string = req.body.password;
    if (!password) throw new BadRequestError('비밀번호를 입력하지 않았습니다.');
    // IDEA: further validation here? ex) 7~12자, 숫자와 영어, 일부 특수문자만 사용 가능
    next();
  } catch (error) {
    next(error);
  }
};

export const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const password: string = req.body.password;
    const hashedPassword: string = await generateHashedPassword(password);
    res.send(hashedPassword);
  } catch (error) {
    next(error);
  }
};
