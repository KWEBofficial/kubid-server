import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Products from './products.entity';

/*
Table tags {
  id integer [primary key]
  product_id integer
  tag varchar
}
  */
@Entity()
export default class Tags {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tag!: string;

  /////////참조를 위해 추가///////////
  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product!: Products;
  /////////참조를 위해 추가///////////
}
