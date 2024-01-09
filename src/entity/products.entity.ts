import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user.entity';
import Department from './department.entity';
import { BaseEntity } from './base.entity';

/*
Table product {
  id integer [primary key]
  product_name varchar
  user_id integer
  desc text [note: 'Content of the post']
  status varchar
  lower_bound integer
  upper_bound integer
  image_id integer
  trading_place varchar
  trading_time varchar
  department_id integer
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

}
products.department_id > departments.id

*/
@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productName!: string;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
  /////////참조를 위해 추가///////////

  @Column('text', { comment: 'description of product' })
  desc!: string;

  @Column()
  status!: 'progress' | 'complete';

  @Column()
  lowerBound!: number;

  @Column()
  upperBound!: number;

  @Column()
  imageId!: number;

  @Column()
  tradingPlace!: string;

  @Column()
  tradingTime!: string;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department!: Department;
  /////////참조를 위해 추가///////////
}
