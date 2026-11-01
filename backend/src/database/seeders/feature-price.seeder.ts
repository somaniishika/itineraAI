import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeaturePrice } from 'src/modules/feature-management/entities/feature-price.entity';
import { Repository } from 'typeorm';
import { FeatureType } from 'src/common/utils/feature-type.enum';

@Injectable()
export class FeaturePriceSeeder implements OnModuleInit {
  private readonly logger = new Logger(FeaturePriceSeeder.name);

  constructor(
    @InjectRepository(FeaturePrice)
    private readonly featurePriceRepository: Repository<FeaturePrice>,
  ) {}

  async onModuleInit() {
    const featureSeedData = [
      { featureType: FeatureType.ITINERARY, priceAmount: 49, currency: 'INR' },
      { featureType: FeatureType.BUDGET_PLAN, priceAmount: 20, currency: 'INR' },
      { featureType: FeatureType.CUSTOM_ITINERARY, priceAmount: 20, currency: 'INR' },
      { featureType: FeatureType.PACKING_LIST, priceAmount: 15, currency: 'INR' },
      { featureType: FeatureType.TRIP_GUIDE, priceAmount: 15, currency: 'INR' },
      { featureType: FeatureType.EMERGENCY_CONTACT, priceAmount: 11, currency: 'INR' },
    ];

    for (const data of featureSeedData) {
      const existing = await this.featurePriceRepository.findOne({
        where: { featureType: data.featureType },
      });

      if (!existing) {
        const newFeature = this.featurePriceRepository.create(data);
        await this.featurePriceRepository.save(newFeature);
        this.logger.log(`[Seeder] Created feature price for ${data.featureType}`);
      } else {
        this.logger.log(`[Seeder] Feature price for ${data.featureType} already exists. Skipping.`);
      }
    }
  }
}
