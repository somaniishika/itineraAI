import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';

@Injectable()
export class FeedbackAnalyticsRepository extends Repository<Feedback> {
  constructor(private dataSource: DataSource) {
    super(Feedback, dataSource.createEntityManager());
  }

  private async getAnalytics(
    type: 'monthly' | 'yearly',
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.createQueryBuilder('feedback');

    let selectField = '';
    let groupByField = '';

    if (type === 'monthly') {
      selectField = "TO_CHAR(feedback.created_at, 'Mon YYYY')";
      groupByField = 'month';
      query.select(selectField, groupByField);
    } else if (type === 'yearly') {
      selectField = "EXTRACT(YEAR FROM feedback.created_at)::int";
      groupByField = 'year';
      query.select(selectField, groupByField);
    }

    query
      .addSelect('COUNT(*)', 'total')
      .addSelect('ROUND(AVG(feedback.rating)::numeric, 2)::float', 'averageRating')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating >= 4)', 'positive')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating = 3)', 'neutral')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating <= 2)', 'negative')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating = 1)', 'r1')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating = 2)', 'r2')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating = 3)', 'r3')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating = 4)', 'r4')
      .addSelect('COUNT(*) FILTER (WHERE feedback.rating = 5)', 'r5');

    if (startDate) {
      query.andWhere('feedback.created_at >= :startDate', { startDate });
    } else {
      const interval = type === 'monthly' ? '12 months' : '4 years';
      query.andWhere(`feedback.created_at >= NOW() - INTERVAL '${interval}'`);
    }

    if (endDate) {
      query.andWhere('feedback.created_at <= :endDate', { endDate });
    }

    return await query
      .groupBy(groupByField)
      .orderBy(`MIN(feedback.created_at)`, 'ASC')
      .getRawMany();
  }

  async getMonthlyAnalytics(startDate?: string, endDate?: string) {
    return this.getAnalytics('monthly', startDate, endDate);
  }

  async getYearlyAnalytics(startDate?: string, endDate?: string) {
    return this.getAnalytics('yearly', startDate, endDate);
  }
}
