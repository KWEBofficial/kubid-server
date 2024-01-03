import AppDataSource from '../config/dataSource';
import User from '../entity/user.entity';

// 예시 repository입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.

const UserRepository = AppDataSource.getRepository(User).extend({});

export default UserRepository;
