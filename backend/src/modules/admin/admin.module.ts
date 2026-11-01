import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/users.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { AuthModule } from '../auth/auth.module';
import { UserFeatureBalance } from '../feature-management/entities/users-feature-balance.entity';
import { Payment } from '../payment/entities/payment.entity';
import { UserRepository } from '../users/repositories/users.repository';
import { UserAnalyticsRepository } from '../users/repositories/users-analytics.repository';
import { FeedbackRepository } from '../feedback/repositories/feedback.repository';
import { PaymentRepository } from '../payment/repositories/payment.repository';
import { SuspensionRequestRepository } from '../users/repositories/suspension-request.repository';
import { SuspensionRequest } from '../users/entities/suspension-request.entity';
import { AdminQuestionnaireService } from './services/admin-questionnaire.service';
import { Questionnaire } from '../itinerary/entities/questionnaire.entity';
import { QuestionnaireRepository } from './repositories/questionnaire.repository';
import { FeedbackAnalyticsRepository } from '../feedback/repositories/feedback-analytics.repository';
import { PaymentAnalyticsRepository } from '../payment/repositories/payment-analytics.repository';
import { ApiAuditLog } from '../users/entities/api-audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,UserFeatureBalance,Payment,Feedback,SuspensionRequest,Questionnaire,ApiAuditLog]),AuthModule],
  controllers: [AdminController],
  providers: [AdminService,FeedbackRepository,PaymentRepository, UserRepository, SuspensionRequestRepository,AdminQuestionnaireService,QuestionnaireRepository,UserAnalyticsRepository,FeedbackAnalyticsRepository,PaymentAnalyticsRepository],
  exports: [AdminService],
})
export class AdminModule {}
