import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Department from './department.entity';

/*

Table users {
  id integer [primary key]
  password varchar
  nickname varchar
  email varchar
  department_id varchar
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
*/
@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column()
  email!: string;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department!: Department;
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
