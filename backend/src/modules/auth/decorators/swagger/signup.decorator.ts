import {
    ApiOperation,
    ApiInternalServerErrorResponse,
    ApiBadRequestResponse,
    ApiOkResponse,
  } from '@nestjs/swagger';
  import { applyDecorators } from '@nestjs/common';
  
  export function SwaggerSignup() {
    return applyDecorators(
      ApiOperation({
        summary: 'User Signup — creates a new user and sends an OTP',
        description: `Registers a new user and sends an OTP to verify their email.
  
  **Requirements:**
  - Email must be unique and valid.
  - Username must be unique.
  - Password must be between 6–20 characters.
  - Full name and address are required.
  - Returns a success message if registration is valid.
  - If validation fails or user exists, a 400 error is returned.
  - If a service (like email or Supabase) fails, a 500 error is returned.`,
      }),
  
      ApiOkResponse({
        description: 'Signup successful — OTP sent to user email',
        schema: {
          example: {
            success: true,
            message: 'Signup successful! Please verify your email, OTP sent to user email',
          },
        },
      }),
  
      ApiBadRequestResponse({
        description: 'Error: Bad Request',
        schema: {
          oneOf: [
            {
              example: {
                timestamp: '2025-06-03T13:56:47.041Z',
                path: '/auth/signup',
                error: 'Email or username already exists',
              },
            },
            {
              example: {
                timestamp: '2025-06-03T13:57:08.456Z',
                path: '/auth/signup',
                error: ['password must be longer than or equal to 6 characters'],
              },
            },
            {
              example: {
                timestamp: '2025-06-03T13:57:36.590Z',
                path: '/auth/signup',
                error: ['email must be an email'],
              },
            },
            {
              example: {
                timestamp: '2025-06-03T13:57:55.422Z',
                path: '/auth/signup',
                error: ['full_name should not be empty', 'email must be an email'],
              },
            },
            {
              example: {
                timestamp: '2025-06-03T13:58:26.571Z',
                path: '/auth/signup',
                error: ['password must be longer than or equal to 6 characters'],
              },
            },
            {
              example: {
                timestamp: '2025-06-03T13:59:05.026Z',
                path: '/auth/signup',
                error: ['password must be shorter than or equal to 20 characters'],
              },
            },
            {
              example: {
                timestamp: '2025-06-03T14:05:50.415Z',
                path: '/auth/signup',
                error: ['address should not be empty'],
              },
            },
            {
              example: {
                timestamp: '2025-06-03T14:05:50.415Z',
                path: '/auth/signup',
                error: ['Bad control character in string literal in JSON at position 160'],
              },
            },
          ],
        },
      }),
  
      ApiInternalServerErrorResponse({
        description: 'Error: Internal server error',
        schema: {
          example: {
            timestamp: '2025-06-03T14:11:44.958Z',
            path: '/auth/signup',
            error: 'getaddrinfo EAI_AGAIN aws-0-ap-southeast-1.pooler.supabase.com',
          },
        },
      }),
    );
  }
  