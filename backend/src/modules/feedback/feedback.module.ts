import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';
import { FeedbackRepository } from './repositories/feedback.repository';
import { FeedbackAnalyticsRepository } from './repositories/feedback-analytics.repository';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/users.entity';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback,User]),
    UsersModule, ImageModule 
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository,FeedbackAnalyticsRepository],
  exports: [FeedbackService, FeedbackRepository, FeedbackAnalyticsRepository,TypeOrmModule],
})
export class FeedbackModule {}