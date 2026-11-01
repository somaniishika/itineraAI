import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureManagementService } from './feature-management.service';
import { UserFeatureBalance } from './entities/users-feature-balance.entity';
import { FeatureManagementController } from './feature-management.controller';
import { FeaturePriceRepository } from './repositories/feature-price.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFeatureBalance]),
  ],
  controllers: [FeatureManagementController],
  providers: [FeatureManagementService,FeaturePriceRepository],
  exports: [FeatureManagementService,FeaturePriceRepository],
})
export class FeatureManagementModule {}