import { RequestHandler } from 'express';
// import UserService from '../../service/user.service';

import passport from 'passport';
import jwt from 'jsonwebtoken';

import User from '../../entity/user.entity';

export const signIn: RequestHandler = async (req, res, next) => {
  try {
    console.log('CHECK1');
    // local로 등록한 인증과정 실행
    passport.authenticate(
      'local',
      (passportError: Error, user: User, info: { reason: string }) => {
        console.log('CHECK2');
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError || !user) {
          res.status(400).json({ message: info.reason });
          return;
        }
        console.log('CHECK3');
        // user 데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.send(loginError);
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
    console.log('AHHH');
    next(err);
  }
};

module.exports = {
  signIn,
};
