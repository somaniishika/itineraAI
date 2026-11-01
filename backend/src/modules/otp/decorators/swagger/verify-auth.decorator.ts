import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse,ApiBadRequestResponse,ApiInternalServerErrorResponse,ApiForbiddenResponse,ApiUnauthorizedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { VerifyOtpAuthDto } from '../../dto/verify-otp-auth-dto';

export function VerifyOtpAuthSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify OTP for authenticated operations (email change)',
      description: 'Verifies the OTP for email change operations by authenticated users. Requires JWT authentication.',
    }),
    ApiBearerAuth('access-token'),
    ApiBody({
      type: VerifyOtpAuthDto,
      examples: {
        default: {
          summary: 'Verify email change example',
          value: {
            newEmail: 'newuser@example.com',
            otp: '123456',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'OTP verified and email updated successfully',
      schema: {
        example: {
          success: true,
          message: 'Email updated successfully',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T02:56:34.183Z',
              path: '/otp/_verify-auth',
              error: 'Invalid or expired OTP',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T02:57:17.248Z',
              path: '/otp/_verify-auth',
              error:
                "Expected double-quoted property name in JSON at position 39 (line 3 column 1)",
            },
          },
          {
            example: {
              timestamp: '2025-06-05T02:56:57.766Z',
              path: '/otp/_verify-auth',
              error: ['newEmail must be an email'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T02:57:36.351Z',
              path: '/otp/_verify-auth',
              error: ['otp should not be empty', 'otp must be a string'],
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T02:47:00.603Z',
          path: '/otp/_verify-auth',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T02:55:21.840Z',
          path: '/otp/_verify-auth',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-05T03:13:01.909Z',
          path: '/otp/_verify-auth',
        },
      },
    }),
  );
}
