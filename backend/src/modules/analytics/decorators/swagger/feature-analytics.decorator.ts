import { applyDecorators } from '@nestjs/common';
import {ApiOperation,ApiTags,ApiBearerAuth,ApiOkResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiNotFoundResponse,ApiInternalServerErrorResponse} from '@nestjs/swagger';


export function SwaggerGetAnalytics() {
  return applyDecorators(
    ApiTags('Analytics'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get most used features across the platform (Admin Only)',
      description: 'Fetches aggregated feature usage analytics based on user activity.',
    }),

    ApiOkResponse({
      description: 'Analytics fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Analytics fetched successfully',
          data: [
            { feature: 'ITINERARY', usageCount: 85 },
            { feature: 'PACKING_LIST', usageCount: 40 },
          ],
        },
      },
    }),

    ApiUnauthorizedResponse({
      description:'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T09:55:53.006Z',
          path: '/analytics/feature',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T09:56:58.584Z',
          path: '/analytics/feature',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-05T09:56:13.793Z',
          path: '/analytics/feature',
          error: 'Failed to fetch analytics',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[{
          example: {
            timestamp: '2025-06-05T09:57:32.517Z',
            path: '/analytics/feature',
          },},
          {
            example: {
              timestamp: '2025-06-05T09:57:32.517Z',
              path: '/analytics/feature',
              error:'Unexpected error occurred while fetching feature analytics'
            },
          }
          
        ]
        
      },
    }),
  );
}
