import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Farmer } from '../farmers/entities/farmer.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Crop } from '../farmers/entities/crop.entity';

@Injectable()
export class SeedService {
  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seed() {
    const farmerRepository = this.dataSource.getRepository(Farmer);
    const cropRepository = this.dataSource.getRepository(Crop);
    const dataFilePath = path.join('./src/seed/mock/mock.farmers.json');
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    const farmersData: Partial<Farmer>[] = JSON.parse(rawData);

    for (const farmerData of farmersData) {
      const crops =
        (farmerData.crops as unknown as string[]).map(
          (crop) => crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase(),
        ) || [];

      const createdCrops: Crop[] = [];
      for (const cropName of crops) {
        let crop = await cropRepository.findOneBy({ name: cropName });
        if (!crop) {
          crop = cropRepository.create({ name: cropName });
          await cropRepository.save(crop);
        }
        createdCrops.push(crop);
      }

      const farmer = farmerRepository.create({
        ...farmerData,
        crops: createdCrops,
      });
      await farmerRepository.save(farmer);
    }
  }
}
