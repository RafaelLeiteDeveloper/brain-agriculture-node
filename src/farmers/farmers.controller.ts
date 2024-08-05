import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFarmerDto: CreateFarmerDto) {
    await this.farmersService.create(createFarmerDto);
    return { message: 'Farmer created successfully' };
  }

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async findAll() {
    const farmers = await this.farmersService.findAll();
    return farmers;
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async findOne(@Param('id') id: string) {
    const farmer = await this.farmersService.findOne(+id);
    return farmer;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateFarmerDto: UpdateFarmerDto,
  ) {
    await this.farmersService.update(+id, updateFarmerDto);
    return { message: 'Farmer updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.farmersService.remove(+id);
  }

  @Get('dashboard/data')
  async getDashboardData() {
    const chartData = await this.farmersService.getDashboardData();
    return chartData;
  }
}
