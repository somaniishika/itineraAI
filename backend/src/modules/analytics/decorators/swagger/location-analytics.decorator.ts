import { applyDecorators } from '@nestjs/common';
import {ApiOperation, ApiTags, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse} from '@nestjs/swagger';
import { AnalyticsMessages } from '../../constants/analytics.service.messages';
import { LocationAnalyticsResponseDto } from '../../dto/get-location-analytics.dto';

export function SwaggerGetLocationAnalytics() {
  return applyDecorators(
    ApiTags('Analytics'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get most popular destinations among users (Admin Only)',
      description: 'Fetches aggregated location analytics based on user activity.',
    }),

    ApiOkResponse({
      description: 'Analytics fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Analytics fetched successfully',
          data: {
            totalCountries: 1,
            totalItineraries: 6,
            data: [
              {
                country: 'India',
                count: 6,
                percentage: 100,
                rank: 1,
              },
            ],
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T10:19:32.737Z',
          path: '/analytics/locations',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T10:21:06.924Z',
          path: '/analytics/locations',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Location analytics data not found',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[{
          example: {
            timestamp: '2025-06-05T10:21:28.975Z',
            path: '/analytics/locations',
          },},{
            example: {
              timestamp: '2025-06-05T10:21:28.975Z',
              path: '/analytics/locations',
              error: 'Unexpected error occurred while fetching location analytics',
            },
          }
        ]
        
      },
    }),
  );
}

