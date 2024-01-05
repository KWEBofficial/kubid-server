import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import { generateHashedPassword } from '../../util/authentication';
import UserService from '../../service/user.service';
import DepartmentService from '../../service/department.service';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const password: string = req.body.password;
    if (!password) throw new BadRequestError('비밀번호를 입력하지 않았습니다.');

    const hashedPassword: string = await generateHashedPassword(password);

    const email: string = req.body.email;
    if (!email) throw new BadRequestError('이메일을 입력하지 않았습니다.');
    const user = await UserService.getUserByEmail(email);
    if (user) throw new BadRequestError('이미 존재하는 이메일입니다.');

    // TODO: 학과 유효성 검사
    const departmentId: number = Number(req.body.departmentId);
    if (!departmentId)
      throw new BadRequestError(
        '학과를 입력하지 않았거나 유효하지 않은 값입니다.',
      );
    const department = await DepartmentService.getDepartmentById(departmentId);
    if (!department) throw new BadRequestError('존재하지 않는 학과입니다.');

    res.send('good');

    // TODO: DB에 등록

    // TODO: PR
  } catch (error) {
    next(error);
  }
};
