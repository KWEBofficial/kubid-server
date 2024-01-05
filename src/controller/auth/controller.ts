import { RequestHandler } from 'express';

import passport from 'passport';
import jwt from 'jsonwebtoken';

export const signIn: RequestHandler = async (req, res, next) => {
  try {
    // local로 등록한 인증과정 실행
    passport.authenticate(
      'local',
      (passportError: Error, user: any, info: { reason: string }) => {
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError || !user) {
          res.status(400).json({ message: info.reason });
          return;
        }
        // user 데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.send(loginError);
            return;
          }
          // 클라이언트에게 JWT 생성 후 반환
          const token = jwt.sign(
            { id: user.id, name: user.name, auth: user.auth },
            'jwt-secret-key',
          );
          res.json({ token });
        });
      },
    )(req, res);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  signIn,
};
