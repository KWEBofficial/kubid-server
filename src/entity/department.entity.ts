import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/*
Table department {
  id integer [primary key]
  department_name varchar

}
*/
@Entity()
export default class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  departmentName!: string;
}
