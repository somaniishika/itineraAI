import {ApiBearerAuth,ApiOperation,ApiOkResponse,ApiNotFoundResponse,ApiBadRequestResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiResponse} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetProfileDetailsSwaggerDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Get full details of a user — Admin only',
      description: 'Retrieves comprehensive information about a specific user. This endpoint is restricted to admin users only.'
     }),

    ApiOkResponse({
      description: 'User details fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'User details fetched successfully',
          data: {
            user: {
             'id': 19,
             'full_name': 'Ishika somani',
             'username': 'Ishika',
             'email': 'Ishika.somani@systango.com',
             'address': '221B Baker Street, London',
             'role': 'USER',
             'is_suspended': false,
             'email_verified': true,
             'is_deleted': false,
             'deleted_at': null,
             'created_at': '2025-06-02T09:10:21.882Z',
             'updated_at': '2025-06-03T04:02:20.412Z'
            },
            featureCredits: [
              {
                'id': 48,
                'user_id': 19,
                'feature_balances': {
                  'ITINERARY': 5,
                  'TRIP_GUIDE': 1,
                  'BUDGET_PLAN': 3,
                  'PACKING_LIST': 2,
                  'CUSTOM_ITINERARY': 1
                },
                'updated_at': '2025-06-02T09:37:05.275Z'
              },
            ],
            paymentHistory: [
              {
                id: 101,
                amount: 20,
                payment_method: 'card',
                payment_date: '2025-04-01T12:00:00.000Z',
              },
            ],
          },
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          'timestamp': '2025-06-03T11:11:56.911Z',
          'path': '/admin/users/31',
          'error': 'User not found'
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
         'timestamp': '2025-06-03T11:15:04.466Z',
         'path': '/admin/users/19',
         'error': 'Unauthorized'
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        example: {
        'timestamp': '2025-06-03T11:18:24.809Z',
        'path': '/admin/users/22',
        'error': 'USER:  You do not have access to this resource.'
        },
      },
    }),

    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: {
        example: {
            'timestamp': '2025-06-03T11:19:36.272Z',
            'path': '/admin/users/22'
          },
      },
    }),
  );
}
