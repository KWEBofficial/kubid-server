import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/*
Table departments {
  id integer [primary key]
  department_name varchar

}
*/
@Entity()
export default class Departments {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  departmentName!: string;
}
