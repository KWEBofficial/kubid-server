import User from '../entity/user.entity';
import UserRepository from '../repository/user.repository';
import CreateUserDTO from '../type/user/create.input';
import { UpdateUserPasswordDTO } from '../type/user/update.input';
import { UpdateUserNicknameDTO } from '../type/user/update.input';
import { UpdateUserProfileImageDTO } from '../type/user/update.input';

import { InternalServerError } from '../util/customErrors';
import ProductRepository from '../repository/product.repository';
import DepartmentService from './department.service';
import Department from '../entity/department.entity';

export default class UserService {
  static async getUserById(id: number): Promise<User | null> {
    try {
      return await UserRepository.findOne({
        where: { id },
        relations: ['department', 'image'],
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

  static async updateUserPassword(
    id: number,
    UpdateUserPasswordDTO: UpdateUserPasswordDTO,
  ): Promise<User> {
    const updateUserDAO = UpdateUserPasswordDTO;
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

  static async updateUserNickname(
    id: number,
    updateUserNicknameDTO: UpdateUserNicknameDTO,
  ): Promise<User> {
    const updateUserNicknameDAO = updateUserNicknameDTO;
    const updateResult = await UserRepository.update(id, updateUserNicknameDAO);
    if (!updateResult.affected)
      throw new InternalServerError('유저 정보를 수정하지 못했어요.');

    const user = await UserService.getUserById(id);
    if (!user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해 주세요.',
      );

    return user;
  }

  static async updateUserImage(
    id: number,
    updateUserProfileImageDTO: UpdateUserProfileImageDTO,
  ): Promise<User> {
    const updateUserProfileImageDAO = updateUserProfileImageDTO;
    const updateResult = await UserRepository.update(
      id,
      updateUserProfileImageDAO,
    );
    if (!updateResult.affected)
      throw new InternalServerError('유저 정보를 수정하지 못했어요.');

    const user = await UserService.getUserById(id);
    if (!user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해 주세요.',
      );

    return user;
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

  static async getUserDepartmentById(
    userId: number,
  ): Promise<Department | null> {
    try {
      const user = await UserRepository.findOne({
        where: { id: userId },
        relations: ['department'],
      });

      if (user && user.department) {
        return user.department;
      } else {
        return null; // User not found or user has no associated department
      }
    } catch (error) {
      throw new InternalServerError('학과 정보를 불러오는데 실패했습니다.');
    }
  }
}
