import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmersModule } from './farmers/farmers.module';
import { Farmer } from './farmers/entities/farmer.entity';
import { Crop } from './farmers/entities/crop.entity';
import { SeedModule } from './seed/seed.module';

@Module({
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
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
