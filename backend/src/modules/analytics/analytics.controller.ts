import {Controller,Get,UseGuards,Res,HttpStatus,InternalServerErrorException,NotFoundException,BadRequestException,Query} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { SwaggerGetAnalytics } from './decorators/swagger/feature-analytics.decorator';
import { AnalyticsMessages } from './constants/analytics.service.messages';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { LocationAnalyticsResponseDto } from './dto/get-location-analytics.dto';
import { SwaggerGetLocationAnalytics } from './decorators/swagger/location-analytics.decorator';
import { GetPaymentAnalyticsSwaggerDocs } from './decorators/swagger/payment-analytics.swagger';
import { GetPaymentAnalyticsDto } from './dto/get-payment-analytics.dto';
import { Logger } from '@nestjs/common';
import { GetDashboardAnalyticsDto } from './dto/dashboard-analytics.dto';
import { SwaggerGetDashboardAnalytics } from './decorators/swagger/dashboard-analytics.swagger';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth('access-token')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('feature')
  @SwaggerGetAnalytics()
  async getFeatureUsage(@Res() res: Response) {
    try {
      const result: AnalyticsResponseDto[] = await this.analyticsService.getFeatureUsageAnalytics();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: AnalyticsMessages.FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case AnalyticsMessages.FETCH_FAILURE:
          throw new NotFoundException(message);
        default:
          throw new InternalServerErrorException('Unexpected error occurred while fetching feature analytics');
      }
    }
  }

  @Get('/payments')
  @GetPaymentAnalyticsSwaggerDocs()
  async getPaymentAnalytics(@Query() dto: GetPaymentAnalyticsDto) {
    try {
      const response = await this.analyticsService.getPaymentAnalytics(dto);
      return response;
    } catch (error) {
      const message = error?.message;

      switch (message) {
        case AnalyticsMessages.DATE_IN_FUTURE:
        case AnalyticsMessages.START_AFTER_END:
        case AnalyticsMessages.MONTHLY_DATE_RANGE_TOO_SHORT:
        case AnalyticsMessages.YEARLY_DATE_RANGE_TOO_SHORT:
        throw new BadRequestException(message);
        default:
          throw new InternalServerErrorException(
            AnalyticsMessages.UNEXPECTED_ERROR,
          );
      }
    }
  }

  @Get('locations')
  @SwaggerGetLocationAnalytics()
  async getLocationAnalytics(@Res() res: Response) {
    try {
      const result: LocationAnalyticsResponseDto = await this.analyticsService.getLocationAnalytics();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: AnalyticsMessages.FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case AnalyticsMessages.FETCH_FAILURE:
          throw new NotFoundException(message);
        default:
          throw new InternalServerErrorException('Unexpected error occurred while fetching location analytics');
      }
    }
  }

  @Get('/dashboard')
  @SwaggerGetDashboardAnalytics()
  async getDashboardAnalytics(@Query() dto: GetDashboardAnalyticsDto) {
    try {
      const result = await this.analyticsService.getDashboardAnalytics(dto);
      return {
        success: true,
        message: AnalyticsMessages.FETCH_SUCCESS,
        data: result,
      };
    } catch (error) {
      const message = error?.message;
  
      switch (message) {
        case AnalyticsMessages.DATE_IN_FUTURE:
        case AnalyticsMessages.START_AFTER_END:
        case AnalyticsMessages.MONTHLY_DATE_RANGE_TOO_SHORT:
        case AnalyticsMessages.YEARLY_DATE_RANGE_TOO_SHORT:
        throw new BadRequestException(message);
        default:
          throw new InternalServerErrorException(
            AnalyticsMessages.UNEXPECTED_ERROR,
          );
      }
    }
  }
  
}
