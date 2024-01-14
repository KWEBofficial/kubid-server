import { RequestHandler } from 'express';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import { generateHashedPassword } from '../../util/authentication';
import UserService from '../../service/user.service';
import DepartmentService from '../../service/department.service';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../../entity/user.entity';
import * as dotenv from 'dotenv';
import CreateUserDTO from '../../type/user/create.input';
dotenv.config({ path: '../../../.env.dev' });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_URL: string;
      PORT: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      JWT_SECRET_KEY: string;
    }
  }
}

export const signUp: RequestHandler = async (req, res, next) => {
  /*
  #swagger.auto = false;
  #swagger.summary = '회원가입';
  #swagger.tags = ['Auth'];
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreateUserReqDTO',
        },
      },
    },
  };
  #swagger.responses[201] = {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreateUserResDTO',
        },
      },
    },
  };
  */
  try {
    const { password, email, departmentId: departmentIdAsString } = req.body;
    const departmentId = Number(departmentIdAsString);

    if (!password) throw new BadRequestError('비밀번호를 입력해주세요!');
    const hashedPassword: string = await generateHashedPassword(password);

    if (!email) throw new BadRequestError('이메일을 입력해주세요!');
    const user = await UserService.getUserByEmail(email);
    if (user)
      throw new BadRequestError(
        '이미 등록이 되어 있는 이메일 주소에요. 다른 이메일 주소를 입력해 주세요!',
      );

    if (!departmentId) throw new BadRequestError('학과를 선택해주세요!');
    const department = await DepartmentService.getDepartmentById(departmentId);
    if (!department)
      throw new BadRequestError('등록이 되어있지 않은 학과에요.');

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
    // #swagger.responses[201] = { description: 'User registered successfully.' }
    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const signIn: RequestHandler = async (req, res) => {
  /*
  #swagger.auto = false;
  #swagger.summary = '로그인';
  #swagger.tags = ['Auth'];
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/LoginReqDTO',
        },
      },
    },
  };
  #swagger.responses[201] = {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/LoginResDTO',
        },
      },
    },
  };
  */
  try {
    // local로 등록한 인증과정 실행
    passport.authenticate(
      'local',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (passportError: Error, user: User, info: any) => {
        if (info instanceof UnauthorizedError) {
          const errorMessage = JSON.parse(info.message);
          res.status(401).json({
            name: 'UnauthorizedError',
            message: errorMessage,
          });
          return;
        }
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError) {
          // 일반적인 authentication error인 경우
          res.status(500).json({
            name: 'AuthenticationError',
            message: '서버에서 오류가 발생했어요. 다시 시도해주세요!',
          });
          return;
        }

        if (!user) {
          // user의 정보가 DB에 없는 경우
          res.status(400).json({
            name: 'UnauthorizedError',
            message: '등록되지 않은 사용자에요!',
          });
          return;
        }

        // user 데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.status(500).json({
              name: 'InternalError',
              message: '서버에서 오류가 발생했어요. 다시 시도해주세요!',
            });
            return;
          }
          // 클라이언트에게 JWT 생성 후 반환
          const token = jwt.sign(
            { id: user.id, email: user.email, password: user.password },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
          );
          res.status(200).json({ token });
        });
      },
    )(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      name: 'InternalError',
      message: '서버에서 오류가 발생했어요. 다시 시도해주세요!',
    });
  }
};

module.exports = {
  signUp,
  signIn,
};
