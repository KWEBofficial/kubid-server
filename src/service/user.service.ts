import User from '../entity/user.entity';
import UserRepository from '../repository/user.repository';
import CreateUserDTO from '../type/user/create.input';
import UpdateUserDTO from '../type/user/update.input';
import { InternalServerError } from '../util/customErrors';
import DepartmentService from './department.service';

export default class UserService {
  static async getUserById(id: number): Promise<User | null> {
    try {
      return await UserRepository.findOne({
        where: { id },
        relations: ['department'],
      });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오지 못했어요.');
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await UserRepository.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오지 못했어요.');
    }
  }

  static async saveUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const department = await DepartmentService.getDepartmentById(
        createUserDTO.departmentId,
      );

      const createUserDAO = {
        password: createUserDTO.password,
        nickname: createUserDTO.nickname,
        email: createUserDTO.email,
        department: { ...department },
      };

      console.log(createUserDAO);

      const user = UserRepository.create(createUserDAO);
      return await UserRepository.save(user);
    } catch (error) {
      throw new InternalServerError('유저 정보를 저장하지 못했어요.');
    }
  }

  static async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    const updateUserDAO = updateUserDTO;
    const updateResult = await UserRepository.update(id, updateUserDAO);
    if (!updateResult.affected)
      throw new InternalServerError('유저 정보를 수정하지 못했어요.');

    const user = await UserService.getUserById(id);
    if (!user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해 주세요.',
      );

    return user;
  }
}
