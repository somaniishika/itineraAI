import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiBody, ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,} from '@nestjs/swagger';
import { VerifyOtpOpenDto } from '../../dto/verify-otp-open.dto';

export function VerifyOtpOpenSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify OTP for open operations (email verify, password reset)',
      description: 'Verifies the OTP for public cases like email verification and password reset without requiring JWT authentication.',
    }),
    ApiBody({
      type: VerifyOtpOpenDto,
      examples: {
        VERIFY_EMAIL: {
          summary: 'Verify email example',
          value: {
            email: 'user@example.com',
            otp: '123456',
            purpose: 'VERIFY_EMAIL',
          },
        },
        PASSWORD_RESET: {
          summary: 'Password reset example',
          value: {
            email: 'user@example.com',
            otp: '654321',
            purpose: 'PASSWORD_RESET',
            newPassword: 'NewStrongPassword!23',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'OTP verified and action completed successfully.',
      schema: {
        example: {
          message: 'OTP verified and action completed successfully',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T01:56:42.513Z',
              path: '/otp/_verify',
              error: ['email must be an email'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T01:57:07.534Z',
              path: '/otp/_verify',
              error: ['otp should not be empty', 'otp must be a string'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T01:57:32.977Z',
              path: '/otp/_verify',
              error: ['purpose must be one of the following values: '],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T02:00:42.233Z',
              path: '/otp/_verify',
              error: 'Invalid or expired OTP',
            },
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-05T01:53:03.975Z',
          path: '/otp/_verify',
          error: 'User not found',
        },
      },
    }),

    ApiConflictResponse({
      description: 'Error: Conflict',
      schema: {
        example: {
          timestamp: '2025-06-05T02:33:27.197Z',
          path: '/otp/_verify',
          error: 'Email is already verified',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-05T02:21:11.425Z',
          path: '/otp/_verify',
        },
      },
    }),
  );
}
