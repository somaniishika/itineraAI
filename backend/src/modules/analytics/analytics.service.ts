import { Injectable } from '@nestjs/common';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { LocationAnalyticsResponseDto } from './dto/get-location-analytics.dto';
import { PaymentAnalyticsRepository } from '../payment/repositories/payment-analytics.repository';
import { GetPaymentAnalyticsDto } from './dto/get-payment-analytics.dto';
import { validateDateRangeForAnalytics } from './helper/date-ranges';
import { AnalyticsMessages } from './constants/analytics.service.messages';
import { UserAnalyticsRepository } from '../users/repositories/users-analytics.repository';
import { FeedbackAnalyticsRepository } from '../feedback/repositories/feedback-analytics.repository';
import { GetDashboardAnalyticsDto } from './dto/dashboard-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly paymentRepo: PaymentAnalyticsRepository,
    private readonly userAnalyticsRepo: UserAnalyticsRepository,
    private readonly feedbackAnalyticsRepo: FeedbackAnalyticsRepository,
  ) {}

  async getFeatureUsageAnalytics(): Promise<AnalyticsResponseDto[]> {
    try {
      const data = await this.analyticsRepository.getFeatureUsageData();
      if (!data || !data.length) {
        throw new Error(AnalyticsMessages.FETCH_FAILURE);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || AnalyticsMessages.FETCH_FAILURE);
    }
  }

  async getLocationAnalytics(): Promise<LocationAnalyticsResponseDto> {
    try {
      const data = await this.analyticsRepository.getLocationAnalytics();
      if (!data) {
        throw new Error(AnalyticsMessages.FETCH_FAILURE);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || AnalyticsMessages.FETCH_FAILURE);
    }
  }
  
  async getDashboardAnalytics(dto: GetDashboardAnalyticsDto): Promise<any> {
  
  const { type, periodType, startDate, endDate } = dto;
  validateDateRangeForAnalytics(periodType, startDate, endDate);

  const result: Record<string, any> = {};
  const isMonthly = !periodType || periodType === 'monthly';
  const isYearly = !periodType || periodType === 'yearly';
  
  switch (type) {
    case 'users':
      if (isMonthly) {
        result.monthly = await this.userAnalyticsRepo.getMonthlyAnalytics(startDate, endDate);
      }
      if (isYearly) {
        result.yearly = await this.userAnalyticsRepo.getYearlyAnalytics(startDate, endDate);
      }
      break;
  
    case 'feedbacks':
      if (isMonthly) {
        result.monthly = await this.feedbackAnalyticsRepo.getMonthlyAnalytics(startDate, endDate);
      }
      if (isYearly) {
        result.yearly = await this.feedbackAnalyticsRepo.getYearlyAnalytics(startDate, endDate);
      }
      break;
  
    case 'revenue':
      const paymentResult = await this.getPaymentAnalytics({
        type: periodType,
        startDate,
        endDate,
      });
      Object.assign(result, paymentResult.data);
      break;
  
    default:
      break;
  }
  return result;
  }


  async getPaymentAnalytics(dto: GetPaymentAnalyticsDto) {
  const { type, startDate, endDate } = dto;
  
  validateDateRangeForAnalytics(type, startDate, endDate);
  
  const result: Record<string, any> = {};
  switch (type) {
    case 'monthly':
      result.monthly = {
        totalRevenue: await this.paymentRepo.getMonthlyAnalytics(startDate, endDate),
      };
      break;

    case 'yearly':
      result.yearly = {
        totalRevenue: await this.paymentRepo.getYearlyAnalytics(startDate, endDate),
      };
      break;

    default:
      const [monthly, yearly] = await Promise.all([
        this.paymentRepo.getMonthlyAnalytics(startDate, endDate),
        this.paymentRepo.getYearlyAnalytics(startDate, endDate),
      ]);
      result.monthly = { totalRevenue: monthly };
      result.yearly = { totalRevenue: yearly };
      break;
  }
  return {
    success: true,
    message: AnalyticsMessages.FETCH_SUCCESS,
    data: result,
  };
  }
}
