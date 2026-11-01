import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function SwaggerGetDashboardAnalytics() {
  return applyDecorators(
    ApiExtraModels(),
    ApiTags('Analytics'),
    ApiOperation({
      summary: 'Get dashboard analytics: users, feedbacks, revenue',
      description: 'Fetch dashboard-level analytics data filtered by type and optional date range.',
    }),

    // Query Parameters
    ApiQuery({
      name: 'type',
      required: true,
      enum: ['users', 'feedbacks', 'revenue'],
      description: 'Type of analytics to fetch',
    }),
    ApiQuery({
      name: 'periodType',
      required: false,
      enum: ['monthly', 'yearly'],
      description: 'Period of analytics. If not provided, both will be returned.',
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      type: String,
      description: 'Start date in YYYY-MM-DD format',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      type: String,
      description: 'End date in YYYY-MM-DD format',
    }),

    // Success Responses
    ApiOkResponse({
      description: 'Analytics fetched successfully',
      content: {
        'application/json': {
          examples: {
            UsersAnalytics: {
              summary: 'Users data',
              value: {
                success: true,
                message: 'Analytics fetched successfully',
                data: {
                  monthly: [
                    {
                      month: 'May 2025',
                      total: '10',
                      active: '10',
                      suspended: '0',
                      deleted: '0',
                      verified: '10',
                      unverified: '0',
                    },
                  ],
                  yearly: [
                    {
                      year: 2025,
                      total: '15',
                      active: '15',
                      suspended: '0',
                      deleted: '0',
                      verified: '15',
                      unverified: '0',
                    },
                  ],
                },
              },
            },
            RevenueAnalytics: {
              summary: 'Revenue data',
              value: {
                success: true,
                message: 'Analytics fetched successfully',
                data: {
                  monthly: {
                    totalRevenue: [
                      { month: 'May 2025', totalRevenue: '60.00' },
                    ],
                  },
                  yearly: {
                    totalRevenue: [
                      { year: 2025, totalRevenue: '300.00' },
                    ],
                  },
                },
              },
            },
            FeedbackAnalytics: {
              summary: 'Feedback data',
              value: {
                success: true,
                message: 'Analytics fetched successfully',
                data: {
                  monthly: [
                    {
                      month: 'May 2025',
                      total: '12',
                      averageRating: 4.08,
                      positive: '12',
                      neutral: '0',
                      negative: '0',
                      r1: '0',
                      r2: '0',
                      r3: '0',
                      r4: '11',
                      r5: '1',
                    },
                  ],
                  yearly: [
                    {
                      year: 2025,
                      total: '12',
                      averageRating: 4.08,
                      positive: '12',
                      neutral: '0',
                      negative: '0',
                      r1: '0',
                      r2: '0',
                      r3: '0',
                      r4: '11',
                      r5: '1',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    }),
    // Bad Request Responses
    ApiBadRequestResponse({
      description: 'Error:Bad Request',
      content: {
        'application/json': {
          examples: {
            InvalidStartDateFormat: {
              summary: 'Invalid startDate format',
              value: {
                timestamp: '2025-06-02T08:40:14.843Z',
                path: '/analytics/dashboard?type=users&startDate=invalid',
                error: ['startDate must be a valid ISO 8601 date string'],
              },
            },
            DateRangeLessThan28Days: {
              summary: 'Date range less than 28 days',
              value: {
                timestamp: '2025-06-02T08:40:14.843Z',
                path: '/analytics/dashboard?type=users&startDate=invalid',
                error: ['To retrieve analytics, the date range must be at least 28 days.'],
              },
            },
            DateRangeLessThan365Days: {
              summary: 'Date range less than 365 days for yearly analytics',
              value: {
                timestamp: '2025-06-02T08:40:14.843Z',
                path: '/analytics/dashboard?type=users&startDate=invalid',
                error: ['To retrieve yearly analytics, the date range must be at least 365 days.'],
              },
            },
            LeapYearValidationError: {
              summary: 'Leap year validation error',
              value: {
                timestamp: '2025-06-02T08:41:18.676Z',
                path: '/analytics/dashboard?type=feedbacks&startDate=2025-02-29',
                error: ['Invalid date: Feb 29 is allowed only in leap years like 2024, 2008,etc..'],
              },
            },
            StartDateAfterEndDate: {
              summary: 'Start date is after end date',
              value: {
                timestamp: '2025-06-02T08:42:33.046Z',
                path: '/analytics/dashboard?type=users&startDate=2025-02-02&endDate=2025-02-01',
                error: 'startDate must be before endDate.',
              },
            },
            DateInFuture: {
              summary: 'Date in the future',
              value: {
                timestamp: '2025-06-02T08:43:58.243Z',
                path: '/analytics/dashboard?type=feedbacks&startDate=2025-07-02&endDate=2025-08-01',
                error: 'Date cannot be in the future.',
              },
            },
          },
        },
      },
    }),
    
    // Unauthorized
    ApiUnauthorizedResponse({
      description: 'Error:Unauthorized',
      content: {
        'application/json': {
          example: {
            timestamp: '2025-06-02T08:34:37.865Z',
            path: '/analytics/dashboard?type=revenue',
            error: 'Unauthorized',
          },
        },
      },
    }),

    // Forbidden
    ApiForbiddenResponse({
      description: 'Error:Forbidden ',
      content: {
        'application/json': {
          example: {
            timestamp: '2025-06-02T08:35:54.044Z',
            path: '/analytics/dashboard?type=users',
            error: 'USER:  You do not have access to this resource.',
          },
        },
      },
    }),

    // Internal Server Error
    ApiInternalServerErrorResponse({
      description: 'Error:Internal Server error',
      content: {
        'application/json': {
          example: {
            timestamp: '2025-06-02T08:36:55.300Z',
            path: '/analytics/dashboard?type=feedbacks',
          },
        },
      },
    }),
  );
}
