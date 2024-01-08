import User from '../entity/user.entity';
import UserRepository from '../repository/user.repository';
import { CreateUserDTO } from '../type/user/create.input';
import { InternalServerError } from '../util/customErrors';
import DepartmentService from './department.service';

export default class UserService {
  static async getUserById(id: number): Promise<User | null> {
    try {
      return await UserRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await UserRepository.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
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

      const userEntity = UserRepository.create(createUserDAO);
      return await UserRepository.save(userEntity);
    } catch (error) {
      throw new InternalServerError('유저 정보를 저장하는데 실패했습니다.');
    }
  }
}
