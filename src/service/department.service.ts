import Department from '../entity/department.entity';
import DepartmentRepository from '../repository/department.repository';
import { InternalServerError } from '../util/customErrors';

export default class DepartmentService {
  static async getAllDepartments(): Promise<Department[] | null> {
    try {
      return DepartmentRepository.find();
    } catch (error) {
      throw new InternalServerError('학과 정보를 불러오는데 실패했습니다');
    }
  }

  static async getDepartmentById(id: number): Promise<Department | null> {
    try {
      return await DepartmentRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('학과 정보를 불러오는데 실패했습니다');
    }
  }

  static async getDepartmentByName(
    departmentName: string,
  ): Promise<Department | null> {
    try {
      return await DepartmentRepository.findOne({ where: { departmentName } });
    } catch (error) {
      throw new InternalServerError('학과 정보를 불러오는데 실패했습니다');
    }
  }
}
