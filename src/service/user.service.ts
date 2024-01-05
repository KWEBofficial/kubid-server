import User from '../entity/user.entity';
import UserRepository from '../repository/user.repository';
import { InternalServerError } from '../util/customErrors';

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
  /* 
  static async getUsersByAge(age: number): Promise<User[]> {
    try {
      return await UserRepository.find({ where: { age } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
    }
  }

  static async saveUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      const userEntity = await UserRepository.create(createUserInput);
      return await UserRepository.save(userEntity);
    } catch (error) {
      throw new InternalServerError('유저 정보를 저장하는데 실패했습니다.');
    }
  }
  */
}
