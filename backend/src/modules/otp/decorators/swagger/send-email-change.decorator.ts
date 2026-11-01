import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse, 
  ApiBody, 
  ApiBearerAuth, 
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse, } from '@nestjs/swagger';
import { SendOtpDto, SendOtpDtoPublic } from '../../dto/send-otp.dto';

export const SwaggerSendOtpEmailChange = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Send OTP for EMAIL_CHANGE (authentication required)',
      description: 
      `This endpoint sends an OTP to the provided new email address to verify email change for the authenticated user. 
      The user must be logged in and hold the 'USER' role. It validates that the new email isn't already taken by another user before sending the OTP.`
    }),
    ApiBody({
      type: SendOtpDto,
      description: 'New email address and purpose (EMAIL_CHANGE) for OTP request.'
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

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T01:05:57.844Z',
          path: '/otp/email-change',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T01:06:42.221Z',
          path: '/otp/email-change',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),

    ApiConflictResponse({
      description: 'Error: Conflict',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T01:40:56.830Z',
              path: '/otp/email-change',
              error: 'Email is already associated with another account',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T01:07:34.247Z',
              path: '/otp/email-change',
              error: 'OTP limit exhausted. Please try again later',
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
              timestamp: '2025-06-05T01:36:42.025Z',
              path: '/otp/email-change',
              error: ['email must be an email'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T01:37:14.053Z',
              path: '/otp/email-change',
              error: ['purpose must be EMAIL_CHANGE'],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T01:37:41.528Z',
              path: '/otp/email-change',
              error:
                "Expected ',' or '}' after property value in JSON at position 59 (line 4 column 1)",
            },
          },
        ],
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-05T01:38:45.702Z',
          path: '/otp/email-change',
        },
      },
    }),
  );