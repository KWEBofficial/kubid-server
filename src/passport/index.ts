import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import UserService from '../service/user.service'; // User entity 사용 가능하도록 import
import { UnauthorizedError } from '../util/customErrors';
import { verifyPassword } from '../util/authentication';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env.dev' });

const passportConfig = {
  usernameField: 'email',
  passwordField: 'password',
};

const passportVerify = async (email: string, password: string, done: any) => {
  try {
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await UserService.getUserByEmail(email);
    // 검색된 유저 데이터가 없다면 에러 표시
    if (!user) {
      done(null, false, new UnauthorizedError('등록되지 않은 이메일이에요.'));
      return;
    }
    // 검색된 유저 데이터가 있다면 유저 해시된 비밀번호 비교
    const compareResult = await verifyPassword(password, user.password);
    // 해시된 비밀번호가 같다면 유저 데이터 객체 전송
    if (compareResult) {
      done(null, user);
      return;
    } else {
      // 비밀번호가 다를 경우 에러 표시
      done(null, false, new UnauthorizedError('비밀번호가 틀렸어요.'));
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const JWTVerify = async (jwtPayload: any, done: any) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    const user = await UserService.getUserById(jwtPayload.id);
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    if (user) {
      done(null, user);
      return;
    }
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

export const passportConfigFunc = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};
