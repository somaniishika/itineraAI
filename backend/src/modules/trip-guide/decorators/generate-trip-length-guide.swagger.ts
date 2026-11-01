import {ApiCreatedResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiInternalServerErrorResponse,ApiBadRequestResponse,ApiOperation,
  } from '@nestjs/swagger';
  import { applyDecorators } from '@nestjs/common';
  
  export function GenerateTripLengthGuideSwagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Generate a trip length guide based on destination',
        description:'Generates a personalized trip length guide for a user based on the provided destination input. The guide includes travel duration suggestions and relevant tips.',
      }),
      
      ApiCreatedResponse({
        description: 'Trip length guide generated successfully',
        schema: {
          example: {
            message: 'Trip length guide generated successfully',
            guide_id: 6,
            data: {
              destination: 'Mumbai, India',
              recommended_stay: '4–7 Days',
              highlight_reason: "The perfect amount of time to delve into Mumbai's vibrant culture...",
              durations: [
                {
                  title: '1-Day Itinerary – Mumbai in a Flash',
                  description: 'Ideal for those with limited time...',
                },
                {
                  title: '2–3 Days – Exploring Mumbai\'s Soul ',
                  description: 'Dive deeper into the city...',
                },
              ],
              final_tip: 'Embrace the chaos and be open to new experiences!',
            },
          },
        },
      }),
  
      ApiBadRequestResponse({
        description: 'Error: Bad Request',
        schema: {
          oneOf: [
            {
              example: {
                timestamp: '2025-05-27T07:44:33.556Z',
                path: '/trip-length-guide',
                error: [
                  'location must be shorter than or equal to 100 characters',
                  'location must be longer than or equal to 2 characters',
                  'location should not be empty',
                  'location must be a string',
                ],
              },
            },
            {
              example: {
                timestamp: '2025-05-27T07:45:30.474Z',
                path: '/trip-length-guide',
                error: 'Bad control character in string literal in JSON at position 32',
              },
            },
          ],
        },
      }),
  
      ApiUnauthorizedResponse({
        description: 'Error: Unauthorized',
        schema: {
          example: {
            timestamp: '2025-05-27T01:38:35.238Z',
            path: '/trip-length-guide',
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
                timestamp: '2025-05-27T02:26:55.968Z',
                path: '/trip-length-guide',
                error: 'ADMIN:  You do not have access to this resource.',
              },
            },
            {
              example: {
                timestamp: '2025-05-27T02:31:09.255Z',
                path: '/trip-length-guide',
                error: 'You have no remaining credits to generate a trip length guide.',
              },
            },
          ],
        },
      }),
  
      ApiInternalServerErrorResponse({
        description: 'Error: Internal Server Error',
        schema: {
          example: {
            timestamp: '2025-05-27T03:23:05.175Z',
            path: '/trip-length-guide',
            error: 'Unexpected error occurred while processing the request.',
          },
        },
      }),
    );
  }
  