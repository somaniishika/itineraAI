import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBody
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { UserMessages } from '../../constants/user-messages.constant';
import { ChangePasswordDto } from '../../dto/change-password.dto';

export function SwaggerChangePassword() {
  return applyDecorators(
      ApiOperation({
      summary: 'Change User Password (Authenticated)',
      description: `Allows a user to change their password by providing the current and new passwords.

- Requires a valid JWT token.
- Passwords must follow validation rules.
- New password must not be the same as current password.`,
    }),
    ApiBody({ type: ChangePasswordDto }),
    ApiOkResponse({
      description: UserMessages.PASSWORD_CHANGED,
      schema: {
        example: {
          success: true,
          message: 'Password changed successfully.',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: UserMessages.UNAUTHORIZED_DESCRIPTION,
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T18:09:54.918Z',
              path: '/users/change-password',
              error: 'Unauthorized',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T18:28:13.859Z',
              path: '/users/change-password',
              error: 'Current password is incorrect',
            },
          },
        ],
      },
    }),
    ApiForbiddenResponse({
      description: UserMessages.FORBIDDEN_DESCRIPTION,
      schema: {
        example: {
          timestamp: '2025-06-04T18:11:18.018Z',
          path: '/users/change-password',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),
    ApiBadRequestResponse({
      description: UserMessages.BAD_REQUEST_DESCRIPTION,
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T18:18:05.801Z',
              path: '/users/change-password',
              error: [
                'currentPassword must be longer than or equal to 6 characters',
                'currentPassword must be a string',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T18:17:26.581Z',
              path: '/users/change-password',
              error: [
                'newPassword must be longer than or equal to 6 characters',
                'newPassword must be a string',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T18:16:24.415Z',
              path: '/users/change-password',
              error: 'Expected \',\' or \'}\' after property value in JSON at position 59 (line 4 column 1)',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T19:34:49.585Z',
              path: '/users/change-password',
              error: 'New password must be different from current password.',
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: UserMessages.INTERNAL_SERVER_ERROR_DESCRIPTION,
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T19:32:55.578Z',
              path: '/users/change-password',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T19:32:55.578Z',
              path: '/users/change-password',
              error: 'Password not set for user',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T19:32:55.578Z',
              path: '/users/change-password',
              error: 'Failed to update password',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T19:32:55.578Z',
              path: '/users/change-password',
              error: 'An unexpected error occurred',
            },
          },
        ],
      },
    }),
  );
}