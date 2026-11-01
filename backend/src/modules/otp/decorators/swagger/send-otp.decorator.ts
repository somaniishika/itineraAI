import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';

import { SendOtpDtoPublic } from '../../dto/send-otp.dto';

export const SwaggerSendOtpPublic = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Send OTP for VERIFY_EMAIL or PASSWORD_RESET (no authentication required)',
      description: `Triggers an OTP to be sent to the provided email address for the given purpose ('VERIFY_EMAIL' or 'PASSWORD_RESET'). 
      If the email is not associated with an existing user, or the email is already verified for 'VERIFY_EMAIL' purpose, it returns appropriate errors.`,
    }),
  ApiBody({
  type: SendOtpDtoPublic,
  examples: {
    VERIFY_EMAIL: {
      summary: 'Verify email example',
      value: {
        email: 'user@gmail.com',
        purpose: 'VERIFY_EMAIL',
      },
    },
    PASSWORD_RESET: {
      summary: 'Password reset example',
      value: {
        email: 'user@gmail.com',
        purpose: 'PASSWORD_RESET',
      },
    },
  },
}),
    ApiOkResponse({
      description: 'OTP sent successfully',
      schema: {
        example: {
          message: 'OTP sent successfully',
          data: {
            otpSent: true,
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
              timestamp: '2025-06-04T19:55:11.926Z',
              path: '/otp',
              error: ['purpose must be VERIFY_EMAIL or PASSWORD_RESET'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T19:54:46.721Z',
              path: '/otp',
              error:
                'Expected double-quoted property name in JSON at position 33 (line 4 column 1)',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T19:55:34.010Z',
              path: '/otp',
              error: ['email must be an email'],
            },
          },
        ],
      },
    }),
    ApiConflictResponse({
      description: 'Error: Conflict',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T19:57:03.931Z',
              path: '/otp',
              error: 'Email is already verified',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T20:15:30.036Z',
              path: '/otp',
              error: 'OTP limit exhausted. Please try again later',
            },
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-04T20:04:55.040Z',
          path: '/otp',
          error: 'User not found',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-04T20:05:19.970Z',
          path: '/otp',
        },
      },
    }),
  );
