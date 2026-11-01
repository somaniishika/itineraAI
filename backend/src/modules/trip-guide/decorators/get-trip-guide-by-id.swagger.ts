import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetTripLengthGuideByIdSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a trip length guide by ID',
      description:'Retrieves a specific trip length guide by its unique ID. Includes content such as travel recommendations and tips based on trip duration.',
    }),
    ApiOkResponse({
      description: 'Trip length guide fetched successfully',
      schema: {
        example: {
          id: 8,
          user_id: 5,
          location: 'Indore,India',
          content: {
            destination: 'Indore, India',
            recommended_stay: '3–5 Days',
            highlight_reason: 'An ideal duration to delve into Indore\'s royal heritage...',
            durations: [
              {
                title: '1-Day Itinerary – A Taste of Indore',
                description: 'Perfect for a quick stop...',
              },
              {
                title: '2–3 Days – Heritage & Flavors',
                description: 'With a few extra days, you can explore...',
              },
            ],
            final_tip: 'Start your day with a poha-jalebi breakfast!',
          },
          created_at: '2025-05-27T05:59:05.580Z',
          user: {
            id: 5,
            email: 'Ishika.somani@systango.com',
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        oneOf:[
          {  
          example: {
          timestamp: '2025-05-28T00:50:53.297Z',
          path: '/trip-length-guide/8',
          error: 'Unauthorized',
        },
      },{
        example: {
          timestamp: '2025-05-28T00:50:53.297Z',
          path: '/trip-length-guide/8',
          error: 'You are not allowed to view this Trip Guide',
        },

      }
    ]
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-05-28T00:55:54.443Z',
          path: '/trip-length-guide/1',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-05-28T00:36:20.067Z',
          path: '/trip-length-guide/99',
          error: 'Trip length guide not found',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-05-28T00:59:26.312Z',
          path: '/trip-length-guide/1',
        },
      },
    }),
  );
}
