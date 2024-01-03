import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import './env';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [`${__dirname}/../entity/*.entity.ts`],
  namingStrategy: new SnakeNamingStrategy(),
  logging: false, // sql query를 console에 출력하고 싶을 때는 true로 전환
  synchronize: process.env.NODE_ENV === 'prod' ? false : true,
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
