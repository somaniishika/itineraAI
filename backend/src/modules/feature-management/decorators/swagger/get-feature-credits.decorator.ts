import {ApiOperation,ApiResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiBadRequestResponse,ApiBearerAuth} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { FeatureManagementMessages } from '../../constants/feature-management.messages';

export function SwaggerGetFeatureCredits() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
 ApiOperation({
      summary: 'Get user feature credits',
      description: 'Fetches the feature credit balances for a specific user by ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of user feature credits retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'List of user feature credits retrieved successfully',
          data: {
            user_id: 26,
            feature_balances: {
              ITINERARY: 0,
              BUDGET_PLAN: 0,
              PACKING_LIST: 0,
              CUSTOM_ITINERARY: 0,
              TRIP_GUIDE: 0,
              EMERGENCY_CONTACT: 0,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T03:26:58.521Z',
          path: '/feature-credits',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T03:28:04.938Z',
          path: '/feature-credits',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-05T03:32:27.296Z',
          path: '/feature-credits',
        },
      },
    }),
  );
}
