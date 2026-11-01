import {
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetAdminDashboardAnalyticsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Fetch dashboard analytics data' }),
    ApiQuery({
      name: 'type',
      required: true,
      description: 'Type of analytics to fetch (e.g., users, feedback, revenue)',
      example: 'users',
    }),
    ApiOkResponse({
      description: 'Dashboard analytics fetched successfully for users',
      schema: {
        example: {
          success: true,
          message: 'Dashboard analytics fetched successfully.',
          data: {
            monthly: {
              totalUsers: 15,
              totalactiveUsers: 15,
              totalsuspendedUsers: 0,
              totaldeletedUsers: 0,
              usersCreatedThisPeriod: 8,
              usersCreatedLastPeriod: 4,
              growth: 66.67,
            },
            yearly: {
              totalUsers: 15,
              totalactiveUsers: 15,
              totalsuspendedUsers: 0,
              totaldeletedUsers: 0,
              usersCreatedThisPeriod: 13,
              usersCreatedLastPeriod: 1,
              growth: 92.86,
            },
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Dashboard analytics fetched successfully for feedback',
      schema: {
        example: {
          success: true,
          message: 'Dashboard analytics fetched successfully.',
          data: {
            monthly: {
              currentMonth: {
                totalFeedbacks: 12,
                averageRating: 4.08,
                ratingDistribution: [
                  { rating: 4, count: '11' },
                  { rating: 5, count: '1' },
                ],
              },
              lastMonth: {
                totalFeedbacks: 0,
                averageRating: 0,
                ratingDistribution: [],
              },
            },
            yearly: {
              currentYear: {
                totalFeedbacks: 12,
                averageRating: 4.08,
                ratingDistribution: [
                  { rating: 4, count: '11' },
                  { rating: 5, count: '1' },
                ],
              },
              lastYear: {
                totalFeedbacks: 0,
                averageRating: 0,
                ratingDistribution: [],
              },
            },
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Dashboard analytics fetched successfully for revenue',
      schema: {
        example: {
          success: true,
          message: 'Dashboard analytics fetched successfully.',
          data: {
            monthly: {
              currentMonth: {
                general: {
                  totalPayments: 1,
                  totalRevenue: 25,
                  statusCount: [{ status: 'SUCCESS', count: 1 }],
                },
                byFeatureType: [{ paymentCount: 1, totalRevenue: 25 }],
              },
              lastMonth: {
                general: {
                  totalPayments: 0,
                  totalRevenue: 0,
                  statusCount: [],
                },
                byFeatureType: [],
              },
            },
            yearly: {
              currentYear: {
                general: {
                  totalPayments: 1,
                  totalRevenue: 25,
                  statusCount: [{ status: 'SUCCESS', count: 1 }],
                },
                byFeatureType: [{ paymentCount: 1, totalRevenue: 25 }],
              },
              lastYear: {
                general: {
                  totalPayments: 0,
                  totalRevenue: 0,
                  statusCount: [],
                },
                byFeatureType: [],
              },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - invalid or missing authentication',
      schema: {
        example: {
          timestamp: '2025-05-30T05:09:03.599Z',
          path: '/admin/analytics/dashboard?type=users',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - user does not have access to resource',
      schema: {
        example: {
          timestamp: '2025-05-30T05:08:38.165Z',
          path: '/admin/analytics/dashboard?type=users',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-05-30T05:07:14.951Z',
          path: '/admin/analytics/dashboard?type=revenue',
        },
      },
    }),
  );
}
