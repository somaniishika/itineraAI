import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class UserAnalyticsRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  private async getAnalytics(
    type: 'monthly' | 'yearly',
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.createQueryBuilder('user');

    let selectField = '';
    let groupByField = '';

    if (type === 'monthly') {
      selectField = `TO_CHAR(DATE_TRUNC('month', user.created_at), 'Mon YYYY')`;
      groupByField = 'month';
      query.select(selectField, groupByField);
    } else if (type === 'yearly') {
      selectField = `EXTRACT(YEAR FROM user.created_at)::int`;
      groupByField = 'year';
      query.select(selectField, groupByField);
    }

    query
      .addSelect('COUNT(*)', 'total')
      .addSelect(`COUNT(*) FILTER (WHERE user.is_deleted = false AND user.is_suspended = false)`, 'active')
      .addSelect(`COUNT(*) FILTER (WHERE user.is_suspended = true)`, 'suspended')
      .addSelect(`COUNT(*) FILTER (WHERE user.is_deleted = true)`, 'deleted')
      .addSelect(`COUNT(*) FILTER (WHERE user.email_verified = true)`, 'verified')
      .addSelect(`COUNT(*) FILTER (WHERE user.email_verified = false)`, 'unverified');

    if (startDate) {
      query.andWhere('user.created_at >= :startDate', { startDate });
    } else {
      const interval = type === 'monthly' ? '12 months' : '4 years';
      query.andWhere(`user.created_at >= NOW() - INTERVAL '${interval}'`);
    }

    if (endDate) {
      query.andWhere('user.created_at <= :endDate', { endDate });
    }

    return await query
      .groupBy(groupByField)
      .orderBy(`MIN(user.created_at)`, 'ASC')
      .getRawMany();
  }

  async getMonthlyAnalytics(startDate?: string, endDate?: string) {
    return this.getAnalytics('monthly', startDate, endDate);
  }

  async getYearlyAnalytics(startDate?: string, endDate?: string) {
    return this.getAnalytics('yearly', startDate, endDate);
  }
}
