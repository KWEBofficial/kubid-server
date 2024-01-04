import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Users from './user.entity';
import Departments from './department.entity';
/*
Table products {
  id integer [primary key]
  product_name varchar
  user_id integer
  desc text [note: 'Content of the post']
  status varchar
  lower_bound integer
  upper_bound integer
  image_id integer
  department_id integer
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

}
products.department_id > departments.id

*/
@Entity()
export default class Products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productName!: string;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user!: Users;
  /////////참조를 위해 추가///////////

  @Column('text', { comment: 'description of product' })
  desc!: string;

  @Column()
  status!: string;

  @Column()
  lowerBound!: number;

  @Column()
  upperBound!: number;

  @Column()
  imageId!: number;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Departments)
  @JoinColumn({ name: 'department_id' })
  department!: Departments;
  /////////참조를 위해 추가///////////

  // TypeORM이 적절한 타입을 자동으로 추론하므로 type 지정 불필요
  @CreateDateColumn()
  createdAt!: Date;

  // NULLable == true 이므로, ? 사용
  @UpdateDateColumn()
  updatedAt?: Date;

  // NULLable == true 이므로, ? 사용
  @DeleteDateColumn()
  deletedAt?: Date;
}
