import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Farmer } from './farmer.entity';

@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @ManyToOne(() => Farmer, farmer => farmer.crops, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  farmer: Farmer;
}