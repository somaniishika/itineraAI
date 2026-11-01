import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { FeatureOrder } from 'src/modules/payment/entities/feature-order.entity';
import { Itinerary } from 'src/modules/itinerary/entities/itinerary.entity';
import { AnalyticsResponseDto } from '../dto/analytics-response.dto';
import { LocationAnalyticsResponseDto } from '../dto/get-location-analytics.dto';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(FeatureOrder)
    private readonly featureOrderRepository: Repository<FeatureOrder>,

    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
  ) {}

  async getFeatureUsageData(): Promise<AnalyticsResponseDto[]> {
    const paymentsWithOrders = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.order', 'feature_order')
      .where('payment.status = :status', { status: 'SUCCESS' })
      .getMany();

    const featureCountMap: Record<string, number> = {};

    for (const payment of paymentsWithOrders) {
      const credits = payment.order.feature_credits || {};
      for (const [feature, count] of Object.entries(credits)) {
        featureCountMap[feature] = (featureCountMap[feature] || 0) + Number(count);
      }
    }

    return Object.entries(featureCountMap).map(([feature, usageCount]) => ({
      feature,
      usageCount,
    }));
  }
  
  async getLocationAnalytics(): Promise<LocationAnalyticsResponseDto> {
    const rawData = await this.itineraryRepository
      .createQueryBuilder('itinerary')
      .select('itinerary.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('itinerary.country')
      .orderBy('count', 'DESC')
      .getRawMany();

    const total = rawData.reduce((sum, item) => sum + Number(item.count), 0);

    const data = rawData.map((item, index) => ({
      country: item.country,
      count: Number(item.count),
      percentage: total > 0 ? Number(((item.count / total) * 100).toFixed(2)) : 0,
      rank: index + 1,
    }));

    return {
      totalCountries: rawData.length,
      totalItineraries: total,
      data,
    };
  }
}
