import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../util/customErrors';
import errorHandler from '../../util/errorHandler';

export const decodeToken = (req: any, res: any, next: any) => {
  passport.authenticate('jwt', { session: false });
  // header에서 토큰을 가져오기
  const token = req.header('Authorization');

  if (!token) {
    // 토큰이 없으면 UnauthorizedError
    return next(new UnauthorizedError('Token is missing.'));
  }

  // 토큰 인증+decode하기
  jwt.verify(
    token.replace('Bearer ', ''),
    process.env.JWT_SECRET_KEY,
    (err: unknown, decoded: any) => {
      if (err) {
        return errorHandler(
          new UnauthorizedError('유효하지 않은 토큰입니다.'),
          req,
          res,
          next,
        );
      }

      // decode된 id를 req에 할당
      req.userId = decoded.id;

      // Continue to the next middleware or route handler
      next();
    },
  );
};

module.exports = { decodeToken };
