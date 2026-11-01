import { applyDecorators } from '@nestjs/common';
import { ApiOperation,ApiForbiddenResponse, ApiOkResponse,ApiUnauthorizedResponse,ApiInternalServerErrorResponse, ApiBearerAuth } from '@nestjs/swagger';
export function GetQuestionsWithAnswersSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Fetch questionnaire questions with previous answers (if any)',
      description: `Retrieves a list of questions required for itinerary generation.  
      If the user has previously generated an itinerary, their last submitted answers will be prefilled.
      
      
      **Response Codes:**
      - \`200 OK\`: Questions fetched successfully
      - \`401 Unauthorized\`: Missing or invalid access token
      - \`403 Forbidden\`: Access denied for admins
      - \`500 Internal Server Error\`: Server/network failure`,    

}),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Questions fetched successfully.',
      schema: {
        example: [
          {
            id: 1,
            question_text: 'What is your destination city?',
            field_type: 'text',
            options: null,
            image_url: 'https://example.com/images/destination.png',
            answer: 'Paris',
          },
          {
            id: 2,
            question_text: 'Preferred mode of transport?',
            field_type: 'select',
            options: ['Flight', 'Train', 'Bus'],
            image_url: null,
            answer: 'Flight',
          },
          {
            id: 3,
            question_text: 'Do you prefer budget or luxury accommodations?',
            field_type: 'radio',
            options: ['Budget', 'Luxury'],
            image_url: null,
            answer: null, // no previous answer
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-04T08:29:00.049Z',
          path: '/itinerary/questions',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-04T08:28:38.943Z',
          path: '/itinerary/questions',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-04T08:39:25.634Z',
          path: '/itinerary/questions',
        },
      },
    }),
  );
  
}
