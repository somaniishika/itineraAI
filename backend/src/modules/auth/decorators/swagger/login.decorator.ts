import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';


export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'User Login — logs in a user and returns a JWT token',
      description: `Authenticates a user using their email or username and password.

**Details:**
- Validates email/username and password.
- Returns JWT access token and user profile on success.
- Handles various edge cases: missing input, wrong credentials, unverified email, suspended account.
- Handles malformed JSON and internal service errors.`,
    }),

    ApiOkResponse({
      description: 'Login successful — JWT token and user data returned',
      schema: {
        example: {
          success: true,
          message: 'Login successful',
          data: {
            accessToken: '<JWT_TOKEN>',
            user: {
              id: 19,
              email: 'Ishika.somani@systango.com',
              username: 'Ishika',
              full_name: 'Ishika somani',
              role: 'USER',
            },
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
              timestamp: '2025-06-03T14:18:50.867Z',
              path: '/auth/login',
              error: ['emailOrUsername should not be empty'],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T14:19:15.319Z',
              path: '/auth/login',
              error: ['password should not be empty'],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T14:21:39.594Z',
              path: '/auth/login',
              error: 'Expected \',\' or \'}\' after property value in JSON at position 65',
            },
          },
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorised',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T14:22:45.047Z',
              path: '/auth/login',
              error: 'Invalid email or password',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T14:29:23.134Z',
              path: '/auth/login',
              error: 'Email not verified, OTP sent for verification.',
            },
          },
        ],
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-03T14:25:39.212Z',
          path: '/auth/login',
          error: 'Your account is suspended, Raise review request or contact support',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-03T14:24:29.183Z',
          path: '/auth/login',
          error: 'getaddrinfo EAI_AGAIN aws-0-ap-southeast-1.pooler.supabase.com',
        },
      },
    }),
  );
}
