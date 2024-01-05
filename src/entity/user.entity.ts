import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Department from './department.entity';
import { BaseEntity } from './base.entity';
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
}
