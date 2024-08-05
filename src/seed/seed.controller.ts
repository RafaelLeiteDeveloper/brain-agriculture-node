import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async runSeed() {
    try {
      await this.seedService.seed();
      return { message: 'Seed executed successfully!' };
    } catch (error) {
      return { message: 'Error executing seed', error: error.message };
    }
  }
}
