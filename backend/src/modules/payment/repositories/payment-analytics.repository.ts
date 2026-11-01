import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
@Injectable()
export class PaymentAnalyticsRepository extends Repository<Payment> {
  constructor(private dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }

    async getAnalytics(
    type: any,
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.createQueryBuilder('payment')
      .where("payment.status = 'SUCCESS'");

    let groupByField = '';
    let selectField = '';

    if (type === 'monthly') {
      selectField = "TO_CHAR(payment.created_at, 'Mon YYYY')";
      groupByField = 'month';
      query.select(`${selectField}`, groupByField);
    } else if (type === 'yearly') {
      selectField = "EXTRACT(YEAR FROM payment.created_at)::int";
      groupByField = 'year';
      query.select(`${selectField}`, groupByField);
    }

    query.addSelect('SUM(payment.total_amount)', 'totalRevenue');

    if (startDate) {
      query.andWhere('payment.created_at >= :startDate', { startDate });
    } else {
      const interval = type === 'monthly' ? '12 months' : '4 years';
      query.andWhere(`payment.created_at >= NOW() - INTERVAL '${interval}'`);
    }

    if (endDate) {
      query.andWhere('payment.created_at <= :endDate', { endDate });
    }

    return await query
      .groupBy(groupByField)
      .orderBy(`MIN(payment.created_at)`, 'ASC')
      .getRawMany();
  }

  async getMonthlyAnalytics(startDate?: string, endDate?: string) {
    return this.getAnalytics('monthly', startDate, endDate);
  }

  async getYearlyAnalytics(startDate?: string, endDate?: string) {
    return this.getAnalytics('yearly', startDate, endDate);
  }
}
