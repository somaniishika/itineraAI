import {ApiOperation,ApiParam,ApiInternalServerErrorResponse,ApiOkResponse,ApiUnauthorizedResponse,ApiNotFoundResponse,ApiForbiddenResponse,ApiResponse,} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { FaqServiceMessages } from '../../constants/faq.messages';

export function DeleteFaqSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a FAQ by ID — Admin only',
      description: 'Allows an admin to delete a specific FAQ using its ID.',
    }),
   ApiParam({ name: 'id', type: 'number' }),
    ApiOkResponse({
      description: FaqServiceMessages.DELETE_SUCCESS,
      schema: {
        example: {
          success: true,
          message: FaqServiceMessages.DELETE_SUCCESS
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: FAQ Not Found',
      schema: {
        example: {
         
          timestamp: '2025-05-17T10:45:14.818Z',
          path: '/faqs/18',
          error: FaqServiceMessages.FAQ_NOT_FOUND
        },
      },
    }),
    ApiUnauthorizedResponse({
          description: 'Error: Unauthorized',
            schema: {
              example: {
                 timestamp: '2025-05-18T18:03:35.050Z',
                 path: '/faqs',
                 error: 'Unauthorized'
               },
          },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-05-17T10:48:57.039Z',
          path: '/faqs/18',
          error: FaqServiceMessages.ACCESS_DENIED_MESSAGE,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T08:02:42.609Z',
              path: '/faqs',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T08:02:42.609Z',
              path: '/faqs',
              error:FaqServiceMessages.UNEXPECTED_ERROR,
            },
          },
        ],
      },
    }),
  );
}
