import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiBody,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { UpdateUserStatusDto } from '../../dtos/update-user-status.dto';
import { AdminMessages } from '../../constants/admin.messages';

export function UserStatusSwaggerDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Suspend or reactivate user' ,
      description: 'Allows an admin to suspend or reactivate a user account by updating their suspension status.'
    }),
    ApiQuery({
      name: 'status',
      enum: ['suspend', 'reactivate'],
      required: true,
    }),
    ApiBody({ type: UpdateUserStatusDto }),

    ApiOkResponse({
      description: 'Status updated successfully',
      schema: {
        oneOf: [
          {
            example: {
              success: true,
              message: 'User suspended successfully',
            },
          },
          {
            example: {
              success: true,
              message: 'User reactivated successfully',
            },
          },
        ],
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-21T01:26:32.392Z',
              path: '/admin/users/status?status=suspend',
              error:'User is already suspended',
            },
          },
          {
            example: {
             timestamp: '2025-05-21T01:28:35.072Z',
              path: '/admin/users/status?status=reactivate',
              error:  'User is already active',
            },
          },
          {
            example: {
             timestamp: '2025-05-21T01:28:35.072Z',
              path: '/admin/users/status?status=reactivate',
              error:  'Unexpected token, ...\" \"reason\"\n}\" is not valid JSON',
            },
          },
          {
            example: {
             timestamp: '2025-05-21T01:28:35.072Z',
              path: '/admin/users/status?status=reactivate',
              error:'userId must be a number conforming to the specified constraints',
            },
          },
          {
            example: {
             timestamp: '2025-05-21T01:28:35.072Z',
              path: '/admin/users/status?status=reactivate',
              error:['reason must be longer than or equal to 5 characters',
                'reason should not be empty'
              ]
            },
          },
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-05-21T01:21:11.610Z',
          path: '/admin/users/status?status=suspend',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-05-21T01:00:02.135Z',
          path: '/admin/users/status?status=reactivate',
          error: 'USER:  You do not have access to this resource.'
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          statusCode: 404,
          timestamp: '2025-05-21T01:05:08.490Z',
          path: '/admin/users/status?status=reactivate',
          error: 'User not found',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-21T01:30:58.879Z',
              path: '/admin/users/status?status=suspend',
            },
          },
          {
            example: {
              timestamp: '2025-05-21T01:30:58.879Z',
              path: '/admin/users/status?status=suspend',
              error: AdminMessages.UNEXPECTED_ERROR,
            },
          },
        ],
      },
    }),
  );
}
