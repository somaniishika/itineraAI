import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function SwaggerSubmitFeedback() {
  return applyDecorators(
    ApiOperation({
      summary: 'Submit user feedback with optional images',
      description:
        'Allows a user to submit feedback with a rating, message, and optional images. ' +
        'Includes validation for rating range and image upload limits. ' +
        'Handles authorization and monthly feedback limits.',
    }),

    ApiCreatedResponse({
      description: 'Feedback submitted successfully',
      schema: {
        example: {
          success: true,
          message: 'Feedback submitted successfully',
          data: {
            id: 29,
            user_id: 26,
            rating: 5,
            message: 'Amazing travel experience!',
            images: [
              { url: 'https://example.com/img1.jpg', alt: 'Image 1' },
              { url: 'https://example.com/img2.jpg', alt: 'Image 2' },
            ],
            monthly_feedback_limit: 4,
            created_at: '2025-06-04T22:50:10.899Z',
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T04:18:05.515Z',
          path: '/feedback',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T04:19:04.629Z',
              path: '/feedback',
              error: 'ADMIN:  You do not have access to this resource.',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T04:26:12.970Z',
              path: '/feedback',
              error: 'Monthly feedback limit reached. (5)',
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
              timestamp: '2025-06-05T04:20:49.530Z',
              path: '/feedback',
              error:
                'Unexpected token \',\', ..."message": ,\n  "ratin"... is not valid JSON',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T04:21:45.457Z',
              path: '/feedback',
              error: [
                'rating must not be greater than 5',
                'rating must not be less than 1',
                'rating must be a number conforming to the specified constraints',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T04:23:11.607Z',
              path: '/feedback',
              error: ['rating must not be greater than 5'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T04:23:28.630Z',
              path: '/feedback',
              error: ['rating must not be less than 1'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T04:23:54.399Z',
              path: '/feedback',
              error: ['You can upload a maximum of 3 images.'],
            },
          },
        ],
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T04:19:35.030Z',
              path: '/feedback',
            },
          },

          {
            example: {
              timestamp: '2025-06-05T04:19:35.030Z',
              path: '/feedback',
              error: 'Failed to submit feedback',
            },
          },
        ],
      },
    }),
  );
}

export function SwaggerGetAllFeedbacks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all feedbacks with optional filters — Admin only',
      description:
        'Retrieves all feedbacks with pagination and optional filters like rating. Accessible only by Admins. Supports query parameters for `page`, `limit`, and `rating`.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Page number for pagination (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Number of feedbacks per page (default: 10)',
    }),
    ApiQuery({
      name: 'rating',
      required: false,
      type: Number,
      example: 4,
      description: 'Filter feedbacks by rating (1 to 5)',
    }),

    ApiOkResponse({
      description: 'Feedback fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Feedback fetched successfully.',
          data: [
            {
              id: 34,
              user_id: 19,
              rating: 4,
              message: 'Amazing travel experience!',
              images: [
                {
                  alt: 'Image 1',
                  url: 'https://example.com/img1.jpg',
                },
                {
                  alt: 'Image 2',
                  url: 'https://example.com/img2.jpg',
                },
              ],
              monthly_feedback_limit: 4,
              created_at: '2025-06-04T23:15:51.228Z',
              user: {
                id: 19,
                full_name: 'Ishika somani',
                email: 'somanishekhar081@gmail.com',
              },
            },
          ],
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T04:43:44.028Z',
          path: '/feedback?page=1&limit=10&rating=4',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T04:42:57.966Z',
          path: '/feedback?page=1&limit=10&rating=4',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request — Invalid query parameters',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T04:47:23.456Z',
              path: '/feedback?page=0&limit=10',
              error: ['page must not be less than 1'],
            },
          },

          {
            example: {
              timestamp: '2025-06-05T04:47:23.456Z',
              path: '/feedback?page=1&limit=0',
              error: ['limit must not be less than 1'],
            },
          },
        ],
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T04:48:02.375Z',
              path: '/feedback?page=1&limit=11',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T04:48:02.375Z',
              path: '/feedback?page=1&limit=11',
              error: 'Failed to fetch feedbacks',
            },
          },
        ],
      },
    }),
  );
}
