import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: number;
}
