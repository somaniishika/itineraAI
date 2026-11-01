import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse,ApiInternalServerErrorResponse,ApiUnauthorizedResponse,ApiForbiddenResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiQuestionnaireListResponse } from './questionnaire';
export function GetAllQuestionnairesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all itinerary questionnaires (Admin only)',
      description: `Fetches a complete list of all questionnaire entries from the database.  
This data is used for training the AI model to personalize itineraries based on user preferences.`,
    }),
    ApiBearerAuth('access-token'),
    ApiQuestionnaireListResponse,
    
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-03T11:26:57.253Z',
          path: '/admin/questionnaire',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-03T11:31:21.063Z',
          path: '/admin/questionnaire',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T11:35:19.025Z',
              path: '/admin/questionnaire',
              error: 'Failed to retrieve questionnaire list.',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T11:35:19.025Z',
              path: '/admin/questionnaire',
            },
          },
        ],
      },
    }),
  );
}
