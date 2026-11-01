import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse,ApiNotFoundResponse,ApiOperation, ApiOkResponse,ApiInternalServerErrorResponse,ApiBody,ApiBadRequestResponse} from '@nestjs/swagger';
import { ReviewRequestDto } from '../../dto/review-request.dto';

export function ReviewRequestSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Submit account suspension review request',
      description: 'Allows a user whose account is suspended to submit a review request message for admin consideration.',
    }),
    ApiBody({
      type: ReviewRequestDto,
      examples: {
        default: {
          summary: 'Basic review request example',
          value: {
            email: 'suspendeduser@example.com',
            message: 'I believe my suspension was a mistake. Please review my case.',
          },
        },
      },
    }),
    ApiOperation({
      summary: 'Submit Review Request — for suspended accounts',
      description: `Allows a suspended user to request a manual account review by submitting a message.

**Response Details:**
- Returns \`200 OK\` on successful submission.
- Handles invalid email or missing message with \`400 Bad Request\`.
- Returns \`409 Conflict\` if a review request has already been submitted.
- Handles malformed JSON and internal service errors.`,
    }),

    ApiOkResponse({
      description: 'Review request submitted successfully',
      schema: {
        example: {
          success: true,
          message: 'Review request submitted successfully.',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T07:59:14.647Z',
              path: '/auth/review-request',
              error: ['email must be an email'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T07:59:41.096Z',
              path: '/auth/review-request',
              error: ['message should not be empty'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T08:00:01.587Z',
              path: '/auth/review-request',
              error: 'Bad control character in string literal in JSON at position 118',
            },
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-04T08:08:43.940Z',
          path: '/auth/review-request',
          error: 'No user found with the provided email or account is not suspended',
        },
      },
    }),

    ApiConflictResponse({
      description: 'Error: Conflict',
      schema: {
        example: {
          timestamp: '2025-06-04T07:54:47.280Z',
          path: '/auth/review-request',
          error: 'A review request has already been submitted.',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-04T07:56:22.918Z',
          path: '/auth/review-request',
          error: 'getaddrinfo EAI_AGAIN aws-0-ap-southeast-1.pooler.supabase.com',
        },
      },
    }),
  );
}

