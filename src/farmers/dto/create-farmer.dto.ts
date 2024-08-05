import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { BrazilianState } from '../enums/state.enum';

export class CreateFarmerDto {
  @IsNotEmpty()
  @IsString()
  farmerName: string;

  @IsNotEmpty()
  @IsString()
  farmName: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(BrazilianState)
  state: BrazilianState;

  @IsNotEmpty()
  @IsNumber()
  totalFarmArea: number;

  @IsNotEmpty()
  @IsNumber()
  totalArableArea: number;

  @IsNotEmpty()
  @IsNumber()
  totalVegetationArea: number;

  @ValidateIf((o) => !o.cnpj)
  @IsOptional()
  @IsString()
  cpf?: string | null;

  @ValidateIf((o) => !o.cpf)
  @IsOptional()
  @IsString()
  cnpj?: string | null;

  @IsOptional()
  @IsString({ each: true })
  crops?: string[];
}
