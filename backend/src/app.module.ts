import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminSeeder } from './database/seeders/admin.seeder';
import { CronModule } from './modules/cron/cron.module';
import { OtpModule } from './modules/otp/otp.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { FaqModule } from './modules/faq/faq.module';
import { AdminModule } from './modules/admin/admin.module';
import { ItineraryModule } from './modules/itinerary/itinerary.module';
import { PaymentModule } from './modules/payment/payment.module';
import { FeatureManagementModule } from './modules/feature-management/feature-management.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { AiModule } from './modules/provider/ai-model/ai.module';
import { TripLengthGuideModule } from './modules/trip-guide/trip-length-guide.module';
import { ImageModule } from './modules/image/image.module';
import { RazorpayModule } from './modules/provider/razorpay/razorpay.module';
import { FeaturePriceSeeder } from './database/seeders/feature-price.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturePrice } from './modules/feature-management/entities/feature-price.entity';
import { QuestionnaireSeeder } from './database/seeders/questionnaire.seeder';
import { Questionnaire } from './modules/itinerary/entities/questionnaire.entity';
import { User } from './modules/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturePrice,Questionnaire,User]),DatabaseModule,AuthModule,UsersModule,CronModule,FeedbackModule,FaqModule,OtpModule,AdminModule,ItineraryModule,PaymentModule,FeatureManagementModule,AnalyticsModule,EmergencyModule,AiModule,TripLengthGuideModule,ImageModule, RazorpayModule],
  controllers: [AppController],
  providers: [AdminSeeder,Logger,FeaturePriceSeeder,QuestionnaireSeeder],
})
export class AppModule {}
