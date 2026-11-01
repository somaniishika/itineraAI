import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripLengthGuideController } from './trip-length-guide.controller';
import { TripLengthGuideService } from './trip-length-guide.service';
import { TripLengthGuideRepository } from './repositories/trip-length-guide.repository';
import { TripLengthDirectiveService } from './services/trip-length-directive.service';
import { AiModule } from "../provider/ai-model/ai.module";
import { TripLengthGuide } from './entities/trip-length-guide.entity';
import { SendGridModule } from '../provider/sendgrid/sendgrid.module';
import { UsersModule } from '../users/users.module';
import { FeatureManagementModule } from '../feature-management/feature-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripLengthGuide]),
    SendGridModule,
    UsersModule,
    AiModule,
    FeatureManagementModule,
  ],
  controllers: [TripLengthGuideController],
  providers: [
    TripLengthGuideService,
    TripLengthGuideRepository,
    TripLengthDirectiveService,
  ],
  exports: [TripLengthGuideService],
})
export class TripLengthGuideModule {}