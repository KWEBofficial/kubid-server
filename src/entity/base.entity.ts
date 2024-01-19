import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
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
