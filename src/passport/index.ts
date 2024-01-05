import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import UserService from '../service/user.service'; // User entity 사용 가능하도록 import
import { verifyPassword } from '../util/authentication';

const passportConfig = { usernameField: 'email', passwordField: 'password' };

const passportVerify = async (email: string, password: string, done) => {
  try {
    console.log('passportVerify');
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await UserService.getUserByEmail(email);
    // 검색된 유저 데이터가 없다면 에러 표시
    if (!user) {
      done(null, false, { message: '존재하지 않는 사용자 입니다.' });
      return;
    }
    // 검색된 유저 데이터가 있다면 유저 해시된 비밀번호 비교
    const compareResult = await verifyPassword(password, user.password);
    // 해시된 비밀번호가 같다면 유저 데이터 객체 전송
    if (compareResult) {
      done(null, user);
      return;
    }
    // 비밀번호가 다를 경우 에러 표시
    done(null, false, { reason: '올바르지 않은 비밀번호 입니다.' });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: 'jwt-secret-key',
};

const JWTVerify = async (jwtPayload, done) => {
  try {
    console.log('JWTVerify');
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

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};
