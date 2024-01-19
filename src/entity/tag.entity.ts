import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Product from './products.entity';

/*
Table tags {
  id integer [primary key]
  product_id integer
  tag varchar
}
  */
@Entity()
export default class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tag!: string;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
  /////////참조를 위해 추가///////////
}
