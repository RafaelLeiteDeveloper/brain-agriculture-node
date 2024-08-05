import { Crop } from '../farmers/entities/crop.entity';
import { Farmer } from '../farmers/entities/farmer.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Farmer, Crop],
};

export default new DataSource(dataSourceOptions);