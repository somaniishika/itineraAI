import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Otp } from '../../otp/entities/otp.entity';

@Injectable()
export class OtpCleanupCronService {
  private readonly logger = new Logger(OtpCleanupCronService.name);

  constructor(private readonly dataSource: DataSource) {}

//   @Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_3_HOURS)
  async handleOtpCleanup() {
    this.logger.log('Starting OTP cleanup cron job...');

    const expiryThreshold = new Date();
    expiryThreshold.setHours(expiryThreshold.getHours() - 3);

    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Otp)
      .where('updated_at < :expiryThreshold', { expiryThreshold })
      .execute();

    this.logger.log(`OTP cleanup completed. Deleted ${result.affected} expired OTP(s).`);
  }
}
