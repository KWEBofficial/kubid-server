import AppDataSource from '../config/dataSource';
import Department from '../entity/department.entity';

const DepartmentRepository = AppDataSource.getRepository(Department).extend({});

export default DepartmentRepository;
