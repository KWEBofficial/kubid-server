import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import { generateHashedPassword } from '../../util/authentication';
import UserService from '../../service/user.service';
import DepartmentService from '../../service/department.service';
import CreateUserDTO from '../../type/user/create.input';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../../entity/user.entity';

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { password, email, departmentId: departmentIdAsString } = req.body;
    const departmentId = Number(departmentIdAsString);

    if (!password) throw new BadRequestError('비밀번호를 입력하지 않았습니다.');
    const hashedPassword: string = await generateHashedPassword(password);

    if (!email) throw new BadRequestError('이메일을 입력하지 않았습니다.');
    const user = await UserService.getUserByEmail(email);
    if (user) throw new BadRequestError('이미 존재하는 이메일입니다.');

    if (!departmentId)
      throw new BadRequestError(
        '학과를 입력하지 않았거나 유효하지 않은 값입니다.',
      );
    const department = await DepartmentService.getDepartmentById(departmentId);
    if (!department) throw new BadRequestError('존재하지 않는 학과입니다.');

    // DB에 등록
    const createUserDTO: CreateUserDTO = {
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
      departmentId,
    };
    const saveUserResult = await UserService.saveUser(createUserDTO);

    // API 명세를 따르기 위해 saveUserResult를 바로 돌려주지 않고 userResponse를 선언
    const userResponse = {
      id: saveUserResult.id,
      email: saveUserResult.email,
      nickname: saveUserResult.nickname,
      departmentId,
      createdAt: saveUserResult.createdAt,
    };
    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const signIn: RequestHandler = async (req, res, next) => {
  try {
    // local로 등록한 인증과정 실행
    passport.authenticate(
      'local',
      (passportError: Error, user: User, info: any) => {
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError) {
          // 일반적인 authentication error인 경우
          res.status(400).json({
            name: 'AuthenticationError',
            message: 'Authentication failed.',
          });
          return;
        }

        if (!user) {
          // user의 정보가 DB에 없는 경우
          res.status(401).json({
            name: 'UnauthorizedError',
            message: 'Unauthorized - Invalid credentials.',
          });
          return;
        }
        // user 데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.status(500).json({
              name: 'InternalError',
              message: 'Internal Server Error',
            });
            return;
          }
          // 클라이언트에게 JWT 생성 후 반환
          const token = jwt.sign(
            { id: user.id, nickname: user.nickname, password: user.password },
            'jwt-secret-key',
          );
          res.json({ token });
        });
      },
    )(req, res);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ name: 'InternalError', message: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
  signIn,
};
