import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpRepository } from './repositories/otp.repository';
import { SendGridModule } from '../provider/sendgrid/sendgrid.module';
import { OtpController } from './otp.controller';
import { UsersModule } from '../users/users.module';
import { FeatureManagementModule } from '../feature-management/feature-management.module';

@Module({
  imports: [TypeOrmModule.forFeature([Otp]),SendGridModule,UsersModule,FeatureManagementModule],
  controllers:[OtpController],
  providers: [OtpService, OtpRepository,],
  exports: [OtpService],
})
export class OtpModule {}
