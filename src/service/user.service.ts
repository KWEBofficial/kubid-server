import User from '../entity/user.entity';
import UserRepository from '../repository/user.repository';
import CreateUserDTO from '../type/user/create.input';
import UpdateUserDTO from '../type/user/update.input';
import { InternalServerError } from '../util/customErrors';
import ProductRepository from '../repository/product.repository';
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

      const user = UserRepository.create(createUserDAO);
      return await UserRepository.save(user);
    } catch (error) {
      throw new InternalServerError('유저 정보를 저장하지 못했어요.');
    }
  }

  static async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<number | undefined> {
    try {
      const UpdateUserDAO = updateUserDTO;
      const updateResult = await UserRepository.update(id, UpdateUserDAO);
      return updateResult.affected; // 업데이트된 엔티티의 수
    } catch (error) {
      throw new InternalServerError('유저 정보를 수정하지 못했어요.');
    }
  }

  static async getUserByProductId(productId: number): Promise<User | null> {
    try {
      const product = await ProductRepository.findOne({
        where: { id: productId },
        relations: ['user'],
      });

      if (product) {
        return product.user;
      } else {
        return null; // Product not found
      }
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오지 못했어요.');
    }
  }
}
