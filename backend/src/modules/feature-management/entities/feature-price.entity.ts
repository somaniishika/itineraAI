import { FeatureType } from '../../../common/utils/feature-type.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class FeaturePrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FeatureType,
    unique: true
  })
  featureType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceAmount: number;

  @Column({ length: 5, default: 'INR' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}