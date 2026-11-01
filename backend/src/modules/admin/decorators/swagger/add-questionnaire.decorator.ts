import { applyDecorators } from '@nestjs/common';
import { ApiOperation,ApiInternalServerErrorResponse, ApiUnauthorizedResponse,ApiBadRequestResponse,ApiForbiddenResponse,ApiCreatedResponse } from '@nestjs/swagger';
import { QuestionnaireResponseDto } from '../../dtos/questionnaire-response.dto';
export function  AddQuestionnaireSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new questionnaire question',
      description: `Allows an admin to add a new questionnaire question with a type and optional choices.

- Supports field types like 'text', 'dropdown', 'multi-select', 'date'
- For dropdowns, radios, and checkboxes — valid JSON array required for options`,
    }),
    ApiCreatedResponse({
      description: 'Question created successfully',
      type: QuestionnaireResponseDto,
      schema: {
        example: {
          id: 16,
          question_text: 'Preferred trip duration?',
          field_type: 'dropdown',
          options: ['1-3 days', '4-7 days', '8+ days'],
          image_url: 'https://cdn.swiftotp.com/question-icons/trip-duration.png',
          is_default: false,
          created_by: 20,
          created_at: '2025-06-03T12:34:36.696Z',
          updated_at: '2025-06-03T12:34:36.696Z',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-03T12:33:10.495Z',
          path: '/admin/questionnaire',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-03T12:34:00.055Z',
          path: '/admin/questionnaire',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T12:46:39.890Z',
              path: '/admin/questionnaire',
              error: [
                'question_text must be longer than or equal to 5 characters',
                'question_text should not be empty',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:47:04.629Z',
              path: '/admin/questionnaire',
              error: [
                'field_type must be longer than or equal to 5 characters',
                'field_type should not be empty',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T13:24:37.187Z',
              path: '/admin/questionnaire',
              error: [
                'field_type must be one of the following values: text, dropdown, multi-select, date',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:47:34.031Z',
              path: '/admin/questionnaire',
              error: "Expected ',' or '}' after property value in JSON at position 104",
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:48:11.188Z',
              path: '/admin/questionnaire',
              error: 'Unexpected token \',\', ...""options":,\n  "image"... is not valid JSON',
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
              timestamp: '2025-06-03T12:52:02.996Z',
              path: '/admin/questionnaire',
              error: 'Failed to add questionnaire question',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T12:52:02.996Z',
              path: '/admin/questionnaire',
            },
          },
        ],
      },
    }),
  );
}
