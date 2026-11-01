import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse,ApiUnauthorizedResponse,ApiBadRequestResponse,ApiInternalServerErrorResponse,ApiCreatedResponse,ApiForbiddenResponse,ApiNotFoundResponse } from '@nestjs/swagger';
import { QuestionnaireResponseDto } from '../../dtos/questionnaire-response.dto';

export function EditQuestionnaireQuestionSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Edit an existing questionnaire question',
      description: `Allows an admin to update a questionnaire question's text, type, options, or image.

- **Default questions cannot be edited**
- For 'dropdown', 'radio', and 'checkbox' field types — options are mandatory.`,
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Unique ID of the questionnaire question to update',
      example: 42,
    }),
    ApiOkResponse({
      description: 'Question updated successfully',
      type:QuestionnaireResponseDto,
      schema: {
        example: {
          id: 14,
          question_text: 'Preferred trip duration?',
          field_type: 'dropdown',
          options: ['1-3 days', '4-7 days', '8+ days'],
          image_url: 'https://cdn.swiftotp.com/question-icons/trip-duration.png',
          is_default: false,
          created_by: 20,
          created_at: '2025-06-03T11:51:37.559Z',
          updated_at: '2025-06-03T11:51:37.559Z',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-03T11:53:20.445Z',
          path: '/admin/questionnaire/42',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-03T11:54:41.202Z',
          path: '/admin/questionnaire/1',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-03T11:55:57.155Z',
          path: '/admin/questionnaire/99',
          error: 'Question not found',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T11:55:23.057Z',
              path: '/admin/questionnaire/1',
              error: 'Default questions cannot be edited',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:02:16.656Z',
              path: '/admin/questionnaire/15',
              error: ['question_text must be longer than or equal to 5 characters'],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:05:48.497Z',
              path: '/admin/questionnaire/15',
              error: [
                'field_type must be longer than or equal to 5 characters',
                'field_type must be one of the following values: text, dropdown, multi-select, date',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:06:44.736Z',
              path: '/admin/questionnaire/15',
              error: "Expected ',' or ']' after array element in JSON at position 156",
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:07:06.714Z',
              path: '/admin/questionnaire/15',
              error: 'Unexpected token \',\', ...""3-5 days",\n    "6+ "... is not valid JSON',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:08:09.906Z',
              path: '/admin/questionnaire/15',
              error: ['options must be an array'],
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T12:09:38.884Z',
              path: '/admin/questionnaire/15',
            },
          },
          {
            example: {
              timestamp: '2024-05-20T14:30:00.000Z',
              path: '/admin/questionnaire/42',
              error: 'Failed to update question.',
            },
          },
        ],
      },
    }),
  );
}