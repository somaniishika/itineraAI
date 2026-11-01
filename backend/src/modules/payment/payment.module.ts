import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentAnalyticsRepository } from './repositories/payment-analytics.repository';
import { Payment } from './entities/payment.entity';
import { FeatureOrder } from './entities/feature-order.entity';
import { User } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';
import { FeatureManagementModule } from '../feature-management/feature-management.module';
import { RazorpayModule } from '../provider/razorpay/razorpay.module';
import { FeatureOrderRepository } from './repositories/feture-order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, FeatureOrder, User]),
    UsersModule,FeatureManagementModule,RazorpayModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository,FeatureOrderRepository,PaymentAnalyticsRepository],
  exports: [PaymentService, PaymentRepository,FeatureOrderRepository],
})
export class PaymentModule {}