import { RequestHandler } from 'express';
import DepartmentService from '../../service/department.service';
import { InternalServerError } from '../../util/customErrors';

export const getDepartments: RequestHandler = async (req, res, next) => {
  /*
  #swagger.tags = ['Department'];
  #swagger.summary = '모든 학과 정보 조회';
  #swagger.responses[200] = {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/DepartmentResDTO',
        },
      },
    },
  };
  */
  try {
    const departments = await DepartmentService.getAllDepartments();

    if (!departments)
      throw new InternalServerError('학과 정보를 불러오는데 실패했습니다.');

    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};
