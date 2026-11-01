import { applyDecorators } from '@nestjs/common';
import {ApiBearerAuth,ApiOkResponse,ApiForbiddenResponse,ApiOperation,ApiQuery,ApiUnauthorizedResponse,ApiInternalServerErrorResponse,ApiBadRequestResponse} from '@nestjs/swagger';

export function GetApiAuditLogsSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get API audit logs — Admin only',
      description:
        'Retrieves a paginated list of API audit logs with filters for page and limit. Restricted to admins.',
    }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' }),

    ApiOkResponse({
      description: 'Audit logs fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Audit logs fetched successfully',
          data: [
            {
              id: 28,
              user_id: 19,
              status_code: 500,
              feature: 'PACKING_LIST',
              response_text: '',
              error_message:
                'AI service failed after 9 attempts: {"error":{"code":503,"message":"The model is overloaded. Please try again later.","status":"UNAVAILABLE"}}',
              created_at: '2025-06-04T08:39:16.963Z',
              user: {
                id: 19,
                full_name: 'Ishika somani',
                username: 'Ishika_123',
                email: 'somanishekhar081@gmail.com',
              },
            },
          ],
          meta: {
            total: 13,
            page: 1,
            limit: 1,
            totalPages: 13,
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T05:03:22.918Z',
          path: '/admin/api-audit-logs?page=0',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T05:03:02.907Z',
          path: '/admin/api-audit-logs',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        example: {
          timestamp: '2025-06-05T05:03:59.711Z',
          path: '/admin/api-audit-logs?page=0&limit=0',
          error: [
            'page must not be less than 1',
            'limit must not be less than 1',
          ],
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[
           { 
          example: {
          timestamp: '2025-06-05T05:05:26.111Z',
          path: '/admin/api-audit-logs?page=1&limit=1'
        },},
          { 
          example: {
          timestamp: '2025-06-05T05:05:26.111Z',
          path: '/admin/api-audit-logs?page=1&limit=1',
          error: 'Failed to retrieve audit logs',
        },},
        { 
          example: {
          timestamp: '2025-06-05T05:05:26.111Z',
          path: '/admin/api-audit-logs?page=1&limit=1',
          error: 'Unexpected error occurred while fetching audit logs'
        },},
      ]
       
      },
    }),
  );}
