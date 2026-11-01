import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiBearerAuth,
  ApiTags
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetPaymentAnalyticsSwaggerDocs() {
  return applyDecorators(
    ApiTags('Analytics'),
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get payments analytics — Admin only',
      description: 'Fetches revenue-based analytics grouped by monthly and yearly intervals. Accessible only to admins.',
    }),


    ApiOkResponse({
      description: 'Payment analytics fetched successfully',
      schema: {
        oneOf: [
          {
            example: {
              success: true,
              message: 'Payment analytics fetched successfully',
              data: {
                monthly: [],
                yearly: [],
              },
            },
          },
          {
            example: {
              success: true,
              message: 'Payment analytics fetched successfully',
              data: {
                monthly: [
                  {
                    month: 'May 2025',
                    totalRevenue: '960.00',
                  },
                ],
                yearly: [
                  {
                    year: 2025,
                    totalRevenue: '960.00',
                  },
                ],
              },
            },
          },
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T10:05:38.073Z',
          path: '/analytics/payments',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T10:06:06.062Z',
          path: '/analytics/payments',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      oneOf: [
        {
          example: {
            timestamp: '2025-06-01T05:59:04.301Z',
            path: '/analytics/payments?startDate=shruit&endDate=sjrjiujir',
            error: [
              'startDate must be a valid ISO 8601 date string',
              'endDate must be a valid ISO 8601 date string',
            ],
          },
        },
        {
          example: {
            timestamp: '2025-06-01T03:38:27.304Z',
            path: '/analytics/payments?startDate=2025-05-25&endDate=2025-05-26',
            error: 'To retrieve analytics, the date range must be at least 28 days.',
          },
        },
        {
          example: {
            timestamp: '2025-06-01T06:01:19.061Z',
            path: '/analytics/payments?type=monthly&startDate=2024-02-29&endDate=2024-02-26',
            error: 'startDate must be before endDate.',
          },
        },
        {
          example: {
            timestamp: '2025-06-01T03:41:49.429Z',
            path: '/analytics/payments?type=yearly&startDate=2025-03-25&endDate=2025-05-25',
            error: 'For yearly analytics, date range must be at least 365 days',
          },
        },
        {
          example: {
            timestamp: '2025-06-01T06:00:08.376Z',
            path: '/analytics/payments?startDate=2025-02-29',
            error: [
              'Invalid date: Feb 29 is allowed only in leap years like 2024, 2008,etc..',
            ],
          },
        },
      ],
    },
  }),


    ApiResponse({
      status: 500,
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-31T15:52:02.782Z',
              path: '/analytics/payments',
              error: 'Unexpected error occurred while retrieving analytics.',

            },
          },
          {
            example: {
              timestamp: '2025-05-31T15:52:02.782Z',
              path: '/analytics/payments',
            },
          },
        ],
      },
    }),
  );
}
