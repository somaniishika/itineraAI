import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { AdminMessages } from '../../constants/admin.messages';

export function GetSuspensionRequestsSwaggerDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get user suspension requests with pagination and status',
       description: 'Fetches a paginated list of user suspension requests filtered by their current status (e.g., pending, approved). Supports query parameters for page number and page size.'
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),

    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),

    ApiQuery({
      name: 'status',
      required: false,
      enum: ['PENDING', 'APPROVED'],
      description: 'Filter by suspension status',
      example: 'PENDING',
    }),

    ApiResponse({
      status: 200,
      description: 'Suspension requests fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Suspension requests fetched successfully',
          total: 2,
          page: 1,
          limit: 10,
          data: [
            {
              id: 1,
              user_id: 19,
              username: 'johndoe',
              email: 'john@example.com',
              user_request_message: 'Please reactivate my account.',
              suspension_reason: 'Requested by user',
              status: 'PENDING',
              suspension_date: '2025-05-21T09:00:00.000Z',
            },
            {
              id: 2,
              user_id: 18,
              username: 'janedoe',
              email: 'jane@example.com',
              user_request_message: null,
              suspension_reason: 'Violation of terms',
              status: 'APPROVED',
              suspension_date: '2025-05-20T15:30:00.000Z',
            },
          ],
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-21T06:37:51.108Z',
              path: '/admin/suspension-requests?page=0&limit=2&status=PENDING',
              error:['page must not be less than 1'],
            },
          },
          {
            example: {
              timestamp: '2025-05-21T06:37:51.108Z',
              path: '/admin/suspension-requests?page=0&limit=2&status=PENDING',
              error: ['limit must not be less than 1'],
            },
          },
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-05-21T09:33:00.000Z',
          path: '/admin/suspension-requests',
          error: 'Unauthorized'
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-05-21T09:34:00.000Z',
          path: '/admin/suspension-requests',
          error: 'USER: You do not have access to this resource.'
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-21T06:54:03.980Z',
              path: '/admin/suspension-requests?page=1&limit=10&status=APPROVED',
              error: "No suspension requests found with status 'APPROVED'."
            },
          },
          {
            example: {
              timestamp: '2025-05-21T06:54:03.980Z',
              path: '/admin/suspension-requests?page=1&limit=10&status=APPROVED',
              error: "No suspension requests found with status 'PENDING'."
            },
          },
          {
            example: {
              statusCode: 404,
              timestamp: '2025-05-21T09:35:00.000Z',
              path: '/admin/suspension-requests',
              error: 'No suspension requests found'
            },
          },
        ],
      },
    }),

    ApiInternalServerErrorResponse({
       description: 'Error: Internal Server Error',
      schema: 
      { oneOf: 
        [
        {
          example: {
            timestamp: '2025-05-21T01:30:58.879Z',
            path: '/admin/users/suspension-requests',
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
