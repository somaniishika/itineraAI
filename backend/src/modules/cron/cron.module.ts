import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OtpCleanupCronService } from './jobs/otp-cleanup.cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../otp/entities/otp.entity';
import { ImageCleanupCronService } from './jobs/image-cleanup.cron.service';
import { ImageModule } from '../image/image.module';
import { MonthlyFeedbackCron } from './jobs/monthly-feedback-cron';
import { Feedback } from '../feedback/entities/feedback.entity';
import { User } from '../users/entities/users.entity';
import { FeedbackModule } from '../feedback/feedback.module';
import { UserFeatureBalanceCronService } from './jobs/user-feature-balance-cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Feedback, User, Otp]),
    ImageModule,
    FeedbackModule
  ],
  providers: [OtpCleanupCronService, ImageCleanupCronService, UserFeatureBalanceCronService, MonthlyFeedbackCron],
  exports: [MonthlyFeedbackCron],
})
export class CronModule {}