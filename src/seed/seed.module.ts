import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from '../farmers/entities/farmer.entity';
import { Crop } from '../farmers/entities/crop.entity';
import { FarmersModule } from '../farmers/farmers.module';

@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Farmer, Crop],
      synchronize: true,
      autoLoadEntities: true,
    }),
    FarmersModule,
  ],
})
export class SeedModule {}
