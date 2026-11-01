import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { FeatureOrder } from '../payment/entities/feature-order.entity';
import { Payment } from '../payment/entities/payment.entity';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { Itinerary } from '../itinerary/entities/itinerary.entity';
import { PaymentAnalyticsRepository } from '../payment/repositories/payment-analytics.repository';
import { UserAnalyticsRepository } from '../users/repositories/users-analytics.repository';
import { FeedbackAnalyticsRepository } from '../feedback/repositories/feedback-analytics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureOrder,Payment,Itinerary])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService,AnalyticsRepository,PaymentAnalyticsRepository,UserAnalyticsRepository,FeedbackAnalyticsRepository],
})
export class AnalyticsModule {} 