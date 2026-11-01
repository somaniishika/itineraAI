import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class UserFeatureBalanceCronService {
  private readonly logger = new Logger(UserFeatureBalanceCronService.name);

  constructor(private readonly dataSource: DataSource) {}
  
// @Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetEmergencyContactBalance() {
    this.logger.log('Running optimized cron job to reset EMERGENCY_CONTACT balance...');

    await this.dataSource.query(`
      UPDATE user_feature_balances
      SET feature_balances = jsonb_set(feature_balances, '{EMERGENCY_CONTACT}', '10', true),
          updated_at = now()
      WHERE feature_balances->>'EMERGENCY_CONTACT' IS DISTINCT FROM '10'
    `);

    this.logger.log('Optimized reset complete.');
  }
}
