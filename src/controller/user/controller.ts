import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from '../../util/customErrors';
import UpdateUserDTO from '../../type/user/update.input';
import UserService from '../../service/user.service';
import User from '../../entity/user.entity';
import { generateHashedPassword } from '../../util/authentication';
//import CreateUserInput from '../../type/user/create.input';

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    const { id } = req.user as any;
    const { password, nickname } = req.body as UpdateUserDTO;
    if (!password) throw new BadRequestError('비밀번호를 입력해 주세요.');
    if (!nickname) throw new BadRequestError('닉네임을 입력해 주세요.');

    const hashedPassword: string = await generateHashedPassword(password);
    const updateUserDTO: UpdateUserDTO = { password: hashedPassword, nickname };

    const userAffected = await UserService.updateUser(id, updateUserDTO);
    if (!userAffected)
      throw new InternalServerError('유저 정보를 수정하지 못했어요.');

    const { email, department, createdAt } = (await UserService.getUserById(
      id,
    )) as User;
    const userResponse = {
      id,
      email,
      nickname,
      departmentId: department.id,
      createdAt,
    };
    res.status(200).json(userResponse);
    return;
  } catch (error) {
    next(error);
  }
};
