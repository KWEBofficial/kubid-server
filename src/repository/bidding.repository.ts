import AppDataSource from '../config/dataSource';
import Bidding from '../entity/bidding.entity';

const BiddingRepository = AppDataSource.getRepository(Bidding).extend({});

export default BiddingRepository;
