import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user.entity';
import Product from './products.entity';
import { BaseEntity } from './base.entity';

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
export default class Bidding extends BaseEntity {
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
}
