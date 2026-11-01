import { applyDecorators } from '@nestjs/common';
import { ApiOperation,ApiNotFoundResponse, ApiParam, ApiInternalServerErrorResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiBadRequestResponse,ApiNoContentResponse} from '@nestjs/swagger';

export function DeleteQuestionnaireQuestionSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a questionnaire question (hard delete)',
      description: `Allows an admin to permanently delete a questionnaire question.

- **Default questions cannot be deleted**
- Returns \`204 No Content\` on successful deletion.`,
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Unique ID of the questionnaire question to delete',
      example: 42,
    }),
    ApiNoContentResponse({
      description: 'Question deleted successfully (No Content)',
      headers: {
        'access-control-allow-origin': {
          description: 'CORS header',
          schema: { type: 'string', example: '*' },
        },
        'connection': {
          description: 'Connection type',
          schema: { type: 'string', example: 'keep-alive' },
        },
        'date': {
          description: 'Date of the response',
          schema: { type: 'string', example: 'Tue,03 Jun 2025 13:38:27 GMT' },
        },
        'keep-alive': {
          description: 'Keep-alive timeout',
          schema: { type: 'string', example: 'timeout=5' },
        },
        'x-powered-by': {
          description: 'Framework info',
          schema: { type: 'string', example: 'Express' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-03T13:35:19.338Z',
          path: '/admin/questionnaire/55',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-03T13:36:22.456Z',
          path: '/admin/questionnaire/15',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-03T13:36:52.639Z',
          path: '/admin/questionnaire/15',
          error: 'Question not found',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        example: {
          timestamp: '2025-06-03T13:37:34.581Z',
          path: '/admin/questionnaire/3',
          error: 'Default questions cannot be deleted',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-03T13:41:47.892Z',
          path: '/admin/questionnaire/5',
        },
      },
    }),
  );
}
