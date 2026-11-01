import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { GetPaymentsQueryDto } from '../dto/get-payment-query.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

 async sumRevenueBetween(startDate: Date, endDate: Date): Promise<number> {
  const { sum } = await this.paymentRepo
    .createQueryBuilder('payment')
    .select('SUM(payment.total_amount)', 'sum')
    .where("payment.status = 'SUCCESS'")
    .andWhere('payment.created_at BETWEEN :start AND :end', { start: startDate, end: endDate })
    .getRawOne();

  return parseFloat(sum || '0');
}
async getPaginatedPayments(query: GetPaymentsQueryDto) {
    const { page = 1, limit = 10, status, search } = query;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const qb = this.paymentRepo.createQueryBuilder('payment')
      .leftJoin('payment.user', 'user')
      .leftJoin('payment.order', 'order')
      .select([
        'payment.id',
        'payment.transaction_id',
        'payment.status',
        'payment.total_amount',
        'payment.created_at',

        'user.id',
        'user.username',
        'user.email',

        'order.order_id',
        'order.feature_credits',
        'order.feature_prices',
        'order.total_amount',
      ])
      .orderBy('payment.created_at', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    if (status) {
      qb.andWhere('payment.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(user.username) ILIKE :search OR LOWER(user.email) ILIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [payments, total] = await qb.getManyAndCount();

    return {
      data: payments.map(p => ({
        id: p.id,
        transaction_id: p.transaction_id,
        status: p.status,
        total_amount: p.total_amount,
        created_at: p.created_at,
        user: {
          id: p.user?.id,
          username: p.user?.username,
          email: p.user?.email,
        },
        order: {
          order_id: p.order?.order_id,
          feature_credits: p.order?.feature_credits,
          feature_prices: p.order?.feature_prices,
          total_amount: p.order?.total_amount,
        },
      })),
      pagination: {
        currentPage: safePage,
        limit: safeLimit,
        totalRecords: total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async createPayment(data: Partial<Payment>) {
    const payment = this.paymentRepo.create(data);
    return this.paymentRepo.save(payment);
  }

  async findOne(orderId: string): Promise<Payment | null> {
  return await this.paymentRepo.findOne({ where: { order_id: orderId } });
  }

  async save(payment: Payment): Promise<Payment> {
    return this.paymentRepo.save(payment);
  }

}
