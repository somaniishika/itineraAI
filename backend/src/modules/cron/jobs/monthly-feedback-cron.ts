import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedbackRepository } from 'src/modules/feedback/repositories/feedback.repository';

@Injectable()
export class MonthlyFeedbackCron {
  private readonly logger = new Logger(MonthlyFeedbackCron.name);
  private readonly MONTHLY_FEEDBACK_LIMIT = 5;

  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetMonthlyFeedbackLimit() {
    try {
      await this.feedbackRepo
        .resetAllMonthlyFeedbackLimits(this.MONTHLY_FEEDBACK_LIMIT);

      this.logger.log(
        `Monthly feedback limits reset to ${this.MONTHLY_FEEDBACK_LIMIT} for all feedbacks.`,
      );
    } catch (error) {
      this.logger.error('Error during monthly feedback reset cron job:', error);
    }
  }
}
