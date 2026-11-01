import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FeaturePrice } from '../entities/feature-price.entity';

@Injectable()
export class FeaturePriceRepository extends Repository<FeaturePrice> {
  constructor(private dataSource: DataSource) {
    super(FeaturePrice, dataSource.createEntityManager());
  }

  async findByFeatureType(featureType: string): Promise<FeaturePrice | null> {
    return this.findOne({
      where: { featureType, isActive: true },
    });
  }

  async findAll(): Promise<FeaturePrice[]> {
    return this.find({
      where: { isActive: true },
    });
  }

  async findActiveFeaturePrices(): Promise<
  { featureType: string; priceAmount: number; currency: string }[]
> {
  return this.createQueryBuilder('featurePrice')
    .select([
      'featurePrice.featureType AS "featureType"',
      'featurePrice.priceAmount AS "priceAmount"',
      'featurePrice.currency AS "currency"',
    ])
    .where('featurePrice.isActive = :isActive', { isActive: true })
    .getRawMany();
}

}
