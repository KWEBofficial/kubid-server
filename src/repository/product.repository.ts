import AppDataSource from '../config/dataSource';
import Product from '../entity/products.entity';

const ProductRepository = AppDataSource.getRepository(Product).extend({});

export default ProductRepository;
