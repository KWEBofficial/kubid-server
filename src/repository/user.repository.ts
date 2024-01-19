import AppDataSource from '../config/dataSource';
import User from '../entity/user.entity';

const UserRepository = AppDataSource.getRepository(User).extend({});

export default UserRepository;
