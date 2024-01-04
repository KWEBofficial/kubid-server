import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Users from './user.entity';
import Products from './products.entity';

/*
  
Table biddings {
  id integer [primary key]
  user_id integer
  product_id integer
  price integer
  created_at timestamp
}
  */
@Entity()
export default class Biddings {
  @PrimaryGeneratedColumn()
  id!: number;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user!: Users;
  /////////참조를 위해 추가///////////

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product!: Products;
  /////////참조를 위해 추가///////////
  @Column()
  price!: number;
  // TypeORM이 적절한 타입을 자동으로 추론하므로 type 지정 불필요
  @CreateDateColumn()
  createdAt!: Date;
}
