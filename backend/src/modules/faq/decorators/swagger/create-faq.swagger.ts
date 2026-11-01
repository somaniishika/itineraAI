import {ApiOperation,ApiCreatedResponse,ApiBadRequestResponse,ApiForbiddenResponse,ApiUnauthorizedResponse,ApiResponse,ApiBearerAuth} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { FaqServiceMessages } from '../../constants/faq.messages';

export function CreateFaqSwaggerDocs() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
   ApiOperation({
  summary: 'Create a new FAQ — Admin only',
  description:
    'Allows an admin to create a new FAQ by providing a question and its answer. This endpoint is restricted to users with admin privileges.',
}),

    ApiCreatedResponse({
      description: FaqServiceMessages.CREATE_SUCCESS,
      schema: {
        example: {
          success: true,
          message: FaqServiceMessages.CREATE_SUCCESS,
          data: {
            id: 1,
            question: 'Can I customize my itinerary?',
            answer:
              'Absolutely! You can add or remove destinations, change activities, and adjust travel times.',
            category: 'Features',
            createdAt: '2025-05-16T12:00:00.000Z',
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-16T12:00:00.000Z',
              path: '/faqs',
              error:[
               'Question must be at least 10 characters long and can not be longer than 500 characters.',
               'Question cannot be empty',
              ]
            },
          },
          {
            example: {
              timestamp: '2025-05-17T10:02:01.756Z',
              path: '/faqs',
              error: [
              'Answer must be at least 10 characters long and can not be longer than 2000 characters.',
              'Answer cannot be empty'
            ],
            },
          },
          {
            example: {
              timestamp: '2025-05-17T10:10:08.155Z',
              path: '/faqs',
              error: [
              'Category must be at least 5 characters long and can not be longer than 25 characters.',
              'Category cannot be empty'
            ],
            },
          },
          {
            example: {
              timestamp: '2025-05-17T10:14:44.633Z',
              path: '/faqs',
              error: 'Bad control character in string literal in JSON at position 52',
            },
          },
        ],
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
          timestamp: '2025-05-17T09:47:33.584Z',
          path: '/faqs',
          error: FaqServiceMessages.ACCESS_DENIED_MESSAGE,
        },
      },
    }),

    ApiResponse({
      status: 500,
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-05-16T12:00:00.000Z',
              path: '/faqs',
            },
          },
          {
            example: {
              timestamp: '2025-05-16T12:00:00.000Z',
              path: '/faqs',
              error: FaqServiceMessages.INTERNAL_CREATE_FAIL,
            },
          },
          {
            example: {
              timestamp: '2025-06-03T08:02:42.609Z',
              path: '/faqs',
              error:FaqServiceMessages.UNEXPECTED_ERROR,
            },
          },
          {
            example: {
              timestamp: '2025-06-03T08:02:42.609Z',
              path: '/faqs',
              error:FaqServiceMessages.INTERNAL_UPDATE_FAIL,
            },
          },
        ],
      },
    }),
  );
}
