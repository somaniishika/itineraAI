import { ApiForbiddenResponse,ApiBearerAuth, ApiOperation, ApiBody, ApiOkResponse,ApiBadRequestResponse,ApiUnauthorizedResponse,ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { UserMessages } from '../../constants/user-messages.constant';

export function SwaggerUpdateUser() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update user profile',
      description: `This endpoint allows the currently authenticated user to update their profile information.

- Only accessible with a valid access token.
- Ensures that fields like full name, username, and address are validated.
- Returns the updated user information on success.`,
    }),
    ApiBody({ type: UpdateProfileDto }),
    ApiOkResponse({
      description: 'User profile updated successfully',
      schema: {
        example: {
          success: true,
          message: 'User profile updated successfully',
          data: {
            id: 19,
            full_name: 'Ishika somani',
            username: 'Ishika_123',
            address: '123,Street,Indore',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-04T14:57:24.189Z',
          path: '/users',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-04T14:57:57.594Z',
          path: '/users',
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
              timestamp: '2025-05-19T20:37:22.204Z',
              path: '/users',
              error: 'Username already exists',
            },
          },
          {
            example: {
              error: [
                'username must be longer than or equal to 3 characters',
                'username must be a string',
                'username should not be empty',
              ],

            },
          },
          {
            example: {
              error: [
                'full_name must be longer than or equal to 3 characters',
                'full_name must be a string',
                'full_name should not be empty',
              ],
            },
          },
          {
            example: {
              error: [
                'address must be longer than or equal to 5 characters',
                'address must be a string',
                'address should not be empty',
              ],
            },
          },
          {
            example: {
              error: 'Bad control character in string literal in JSON at position 90 (line 4 column 36)',
            },
          },
          {
            example: {
              error: 'No changes detected in update request',
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[{
        example: {
          timestamp: '2025-06-04T14:58:51.559Z',
          path: '/users',
        }
      },
        {
         example: {
          timestamp: '2025-06-04T14:58:51.559Z',
          path: '/users',
          error:UserMessages.UNEXPECTED_ERROR
        }
        },
      ]
      },
    }),
  );
}
