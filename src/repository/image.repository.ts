import AppDataSource from '../config/dataSource';
import Image from '../entity/image.entity';

const ImageRepository = AppDataSource.getRepository(Image).extend({});

export default ImageRepository;
