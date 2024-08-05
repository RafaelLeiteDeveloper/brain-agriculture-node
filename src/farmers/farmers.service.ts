import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Farmer } from './entities/farmer.entity';
import { Crop } from './entities/crop.entity';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer) private farmerRepository: Repository<Farmer>,
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
  ) {}

  async create(createFarmerDto: CreateFarmerDto): Promise<Farmer> {
    const { crops, ...farmerData } = createFarmerDto;

    const farmer = this.farmerRepository.create(farmerData);
    await this.farmerRepository.save(farmer);

    if (crops && crops.length > 0) {
      const cropEntities = crops.map((cropName) => {
        const crop = this.cropRepository.create({ name: cropName, farmer });
        return crop;
      });
      await this.cropRepository.save(cropEntities);
      farmer.crops = cropEntities;
    }

    return farmer;
  }

  findAll(): Promise<Farmer[]> {
    return this.farmerRepository.find({ relations: ['crops'] });
  }

  async findOne(id: number): Promise<Farmer> {
    try {
      const farmer = await this.farmerRepository.findOneOrFail({
        where: { id },
        relations: ['crops'],
      });
      return farmer;
    } catch (error) {
      throw new NotFoundException(`Farmer with ID ${id} not found`);
    }
  }

  async update(id: number, updateFarmerDto: UpdateFarmerDto): Promise<Farmer> {
    const { crops, ...farmerData } = updateFarmerDto;
    const farmer = await this.findOne(id);

    Object.assign(farmer, farmerData);
    await this.farmerRepository.save(farmer);

    if (crops) {
      await this.cropRepository.delete({ farmer: { id: farmer.id } });

      const cropEntities = crops.map((cropName) => {
        const crop = this.cropRepository.create({ name: cropName, farmer });
        return crop;
      });
      await this.cropRepository.save(cropEntities);
      farmer.crops = cropEntities;
    }

    return farmer;
  }

  async remove(id: number): Promise<void> {
    const farmer = await this.findOne(id);
    await this.farmerRepository.remove(farmer);
  }

  async getDashboardData() {
    const totalFarmers = await this.farmerRepository.count();
    const totalFarmArea = await this.farmerRepository
      .createQueryBuilder('farmer')
      .select('SUM(farmer.totalFarmArea)', 'total')
      .getRawOne();

    const farmsByState = await this.farmerRepository
      .createQueryBuilder('farmer')
      .select('farmer.state', 'state')
      .addSelect('COUNT(farmer.id)', 'count')
      .groupBy('farmer.state')
      .getRawMany();

    const cropsData = await this.cropRepository
      .createQueryBuilder('crop')
      .select('crop.name', 'crop')
      .addSelect('COUNT(crop.id)', 'count')
      .groupBy('crop.name')
      .getRawMany();

    const soilUsage = await this.farmerRepository
      .createQueryBuilder('farmer')
      .select('SUM(farmer.totalArableArea)', 'totalArableArea')
      .addSelect('SUM(farmer.totalVegetationArea)', 'totalVegetationArea')
      .getRawOne();

    return {
      totalFarmers,
      totalFarmArea: totalFarmArea.total,
      farmsByState,
      cropsData,
      soilUsage,
    };
  }
}

