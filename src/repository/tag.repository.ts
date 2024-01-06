import AppDataSource from '../config/dataSource';
import Tag from '../entity/tag.entity';

const TagRepository = AppDataSource.getRepository(Tag).extend({});

export default TagRepository;
