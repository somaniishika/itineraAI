import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function SwaggerGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get authenticated user profile details',
      description: `This endpoint retrieves the profile of a specific user.

      - Only users are authorized to access this endpoint.
      - Requires a valid JWT token.
      - Throws relevant error responses for unauthorized access or internal failures.`,
    }),
    ApiOkResponse({
      description: 'User profile fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'User profile fetched successfully',
          data: {
            id: 19,
            full_name: 'Ishika somani',
            username: 'Ishika',
            email: 'Ishika.somani@systango.com',
            address: '221B Baker Street, London',
            role: 'USER',
            is_suspended: false,
            email_verified: true,
            is_deleted: false,
            deleted_at: null,
            created_at: '2025-06-02T09:10:21.882Z',
            updated_at: '2025-06-04T03:01:40.558Z',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-04T14:30:38.881Z',
          path: '/users',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-04T14:30:05.020Z',
          path: '/users',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[{
        example: {
          timestamp: '2025-06-04T14:32:12.905Z',
          path: '/users',
        }},
        {
          example: {
          timestamp: '2025-06-04T14:32:12.905Z',
          path: '/users',
          error:'Failed to fetch user profile'
        }
      }
      ]
      },
    }),
  );
}
