import {ApiBearerAuth,ApiOperation,ApiInternalServerErrorResponse,ApiOkResponse,ApiBadRequestResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiResponse} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetUsersSwaggerDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Get users list with filtering and pagination — Admin only',
      description: 'Returns a paginated list of users with optional filters such as name, email, or role. Access restricted to admin users.'
     }),

    ApiOkResponse({
      description: 'Users fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Users fetched successfully',
          data: [
            {
              id: 1,
              full_name: 'Jane Doe',
              username: 'jane_doe',
              email: 'jane@example.com',
              address: '123 Lane, City',
              role: 'USER',
              is_suspended: false,
              email_verified: true,
              is_deleted: false,
              created_at: '2025-05-01T10:00:00.000Z',
              updated_at: '2025-05-10T15:00:00.000Z',
            },
            // more users...
          ],
          meta: {
            total: 25,
            page: 1,
            limit: 10,
            totalPages: 3,
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Bad Request due to invalid pagination parameters',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T10:55:04.617Z',
              path: '/admin/users?is_active=false&page=1&limit=0',
              error: ['limit must not be less than 1'],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T10:55:35.786Z',
              path: '/admin/users?is_active=false&page=0',
              error: ['page must not be less than 1'],
            },
          },
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-05-21T10:01:00.000Z',
          path: '/admin/users',
          error: 'Unauthorized'
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-05-21T10:02:00.000Z',
          path: '/admin/users',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-05-21T10:03:00.000Z',
          path: '/admin/users',
        },
      },
    }),
  );
}
