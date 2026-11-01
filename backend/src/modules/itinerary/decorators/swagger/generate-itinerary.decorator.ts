import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse,ApiBadRequestResponse,ApiUnauthorizedResponse,ApiInternalServerErrorResponse,ApiForbiddenResponse, ApiBearerAuth } from '@nestjs/swagger';

export function GenerateItinerarySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Generate a new personalized itinerary (User only)',
      description: `Generates a travel itinerary based on the user's destination, duration, and preferences. AI is used to generate smart recommendations.
      
      **Response Codes**
      - \`200 OK\`: Itinerary generated successfully  
      - \`400 Bad Request\`: Validation / JSON errors  
      - \`401 Unauthorized\` : Missing / invalid token  
      - \`403 Forbidden\`: Admin access blocked **or** user out of credits  
      - \`500 Internal Server Error\` : Upstream AI / email / DB failure`,
    }),
    ApiBearerAuth('access-token'),
    ApiCreatedResponse({
      description: 'Itinerary successfully created for the specified travel location.',
      schema: {
        example: {
          'user_travel_location': 'Andaman and Nicobar Islands',
          'country_name': 'India',
          'itinerary_title': '10 Days of Island Serenity: Andaman & Nicobar Exploration',
          'days': [
            {
              'day': '1',
              'day_title': 'Arrival in Port Blair & Cellular Jail History',
              'tags': ['history', 'arrival', 'colonial'],
              'activities': [
                {
                  'time': '10:00',
                  'title': 'Arrival at Veer Savarkar International Airport, Port Blair',
                  'description': 'Arrive at Port Blair airport, transfer to your hotel. Settle in and freshen up.',
                  'cost': 'NA',
                  'duration': '1 hour'
                },
                {
                  'time': '12:00',
                  'title': 'Lunch at Annapurna Restaurant',
                  'description': 'Enjoy a delicious vegetarian Thali at Annapurna Restaurant, known for its authentic South Indian cuisine.',
                  'cost': '500 INR (6 USD)',
                  'duration': '1 hour'
                }
              ]
            }
          ]
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T08:55:27.275Z',
              path: '/itinerary',
              error: ['travel_location should not be empty'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T08:56:27.930Z',
              path: '/itinerary',
              error: ['country should not be empty'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T08:57:45.997Z',
              path: '/itinerary',
              error: ['Trip duration cannot exceed 10 days'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T08:58:17.068Z',
              path: '/itinerary',
              error: ['Trip duration must be at least 1 day'],
            },
          },
          {
            example: {
              timestamp: '2025-06-04T08:59:24.926Z',
              path: '/itinerary',
              error: "Unexpected token '}', ...\"_answers\"\\n}\" is not valid JSON",
            },
          },
          {
            example: {
              timestamp: '2025-06-04T09:01:16.800Z',
              path: '/itinerary',
              error: ['source_questions_answers must be an object'],
            },
          },
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-04T08:51:38.577Z',
          path: '/itinerary',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T08:52:30.550Z',
              path: '/itinerary',
              error: 'ADMIN:  You do not have access to this resource.',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T09:06:39.082Z',
              path: '/itinerary',
              error: 'You have no remaining credits to generate an itinerary',
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
              timestamp: '2025-06-04T09:11:20.760Z',
              path: '/itinerary',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T09:11:20.760Z',
              path: '/itinerary',
              error: 'Failed to generate a valid itinerary from AI',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T09:11:20.760Z',
              path: '/itinerary',
              error: 'Failed to create itinerary',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T09:11:20.760Z',
              path: '/itinerary',
              error: 'Failed to send itinerary notification email',
            },
          },
        ],
      },
    }),
  );
}
