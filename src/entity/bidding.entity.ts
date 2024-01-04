import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user.entity';
import Product from './products.entity';

/*
  
Table bidding {
  id integer [primary key]
  user_id integer
  product_id integer
  price integer
  created_at timestamp
}
  */
@Entity()
export default class Bidding {
  @PrimaryGeneratedColumn()
  id!: number;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
  /////////참조를 위해 추가///////////

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
  /////////참조를 위해 추가///////////
  @Column()
  price!: number;
  // TypeORM이 적절한 타입을 자동으로 추론하므로 type 지정 불필요
  @CreateDateColumn()
  createdAt!: Date;
}
