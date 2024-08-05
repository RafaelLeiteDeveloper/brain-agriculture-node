import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Crop } from './crop.entity';
import { BrazilianState } from '../enums/state.enum';
import { validateOrReject, IsEnum } from 'class-validator';

@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column()
  farmerName: string;

  @Column()
  farmName: string;

  @Column()
  city: string;

  @Column({
    type: 'enum',
    enum: BrazilianState,
  })
  state: BrazilianState;

  @Column()
  totalFarmArea: number;

  @Column()
  totalArableArea: number;

  @Column()
  totalVegetationArea: number;

  @OneToMany(() => Crop, (crop) => crop.farmer)
  crops: Crop[];

  constructor(props: {
    farmerName: string;
    farmName: string;
    city: string;
    state: BrazilianState;
    totalFarmArea: number;
    totalArableArea: number;
    totalVegetationArea: number;
    cpf?: string | null;
    cnpj?: string | null;
  }) {
    Object.assign(this, props);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);

    if (!this.cpf && !this.cnpj) {
      throw new Error('Either CPF or CNPJ must be provided.');
    }
    if (this.cpf && this.cnpj) {
      throw new Error('Only one of CPF or CNPJ should be provided.');
    }

    if (this.cpf && !/^\d{11}$/.test(this.cpf)) {
      throw new Error('Invalid CPF format.');
    }

    if (this.cnpj && !/^\d{14}$/.test(this.cnpj)) {
      throw new Error('Invalid CNPJ format.');
    }

    if (this.totalArableArea + this.totalVegetationArea > this.totalFarmArea) {
      throw new Error(
        'Total arable area and vegetation area cannot be greater than total farm area.',
      );
    }
  }
}
