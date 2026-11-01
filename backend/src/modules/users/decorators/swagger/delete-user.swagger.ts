import { ApiBearerAuth, ApiOperation, ApiBody, ApiOkResponse,ApiUnauthorizedResponse,ApiInternalServerErrorResponse,ApiBadRequestResponse,ApiForbiddenResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { DeleteDto } from '../../dto/confirm-delete.dto';
import { UserMessages } from '../../constants/user-messages.constant';


export function SwaggerDeleteUser() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: UserMessages.CONFIRM_DEL_SUMMARY,
      description: `Allows a user to delete their account after confirming their password.

- Requires a valid access token.
- Accepts password in the body.
- Returns a confirmation message upon successful deletion.`,
    }),
    ApiBody({ type: DeleteDto }),
    ApiOkResponse({
      description: UserMessages.DEL_SUCCESS_DESCRIPTION,
      schema: {
        example: {
          success: true,
          message: 'Account deleted successfully.',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: UserMessages.UNAUTHORIZED_DESCRIPTION,
      schema: {
        oneOf:[
          {
          example: {
          timestamp: '2025-06-04T14:57:24.189Z',
          path: '/users',
          error: 'Unauthorized',
        }
      },
        {
          example: {
            timestamp: '2025-06-04T22:06:50.196Z',
            path: '/users',
            error: 'Password is incorrect.',
          },
          }
      ]
      },
    }),
    ApiForbiddenResponse({
      description: UserMessages.FORBIDDEN_DESCRIPTION,
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
              timestamp: '2025-06-04T22:06:50.196Z',
              path: '/users',
              error: [
                'password must be a string',
                'password should not be empty',
                'password must be longer than or equal to 6 characters',
              ],
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: UserMessages.INTERNAL_SERVER_ERROR_DESCRIPTION,
      schema: {
        oneOf:[{
        example: {
          timestamp: '2025-06-04T14:58:51.559Z',
          path: '/users',
        }},{
          example: {
            timestamp: '2025-06-04T14:58:51.559Z',
            path: '/users',
            error:UserMessages.UNEXPECTED_ERROR
          }

        }
      ]
      },
    }),
  );
}


