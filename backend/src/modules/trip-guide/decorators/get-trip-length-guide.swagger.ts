import {
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
  } from '@nestjs/swagger';
  import { applyDecorators } from '@nestjs/common';
  
  export function GetItineraryDetailsSwagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get all trip length guides for the current user',
        description:'Retrieves a paginated list of all trip length guides created by the currently authenticated user. Supports optional query parameters for pagination.',
      }),
  
      ApiOkResponse({
        description: 'Successful response with itinerary details',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 10 },
              user_id: { type: 'integer', example: 5 },
              location: { type: 'string', example: 'Udaipur' },
              content: {
                type: 'object',
                properties: {
                  destination: { type: 'string', example: 'Udaipur' },
                  recommended_stay: { type: 'string', example: '3–5 Days' },
                  durations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          example: '1-Day Itinerary – A Whirlwind Romance with Udaipur',
                        },
                        description: {
                          type: 'string',
                          example: "Perfect for those short on time, this itinerary focuses on Udaipur's most iconic landmarks.",
                        },
                      },
                    },
                  },
                  final_tip: {
                    type: 'string',
                    example: 'Wake up early and witness the sunrise over Lake Pichola.',
                  },
                },
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-05-27T06:06:36.648Z',
              },
            },
          },
        },
      }),
  
      ApiUnauthorizedResponse({
        description: 'Error: Unauthorized',
        schema: {
          example: {
            timestamp: '2025-05-27T11:58:22.755Z',
            path: '/trip-length-guide',
            error: 'Unauthorized',
          },
        },
      }),
  
      ApiForbiddenResponse({
        description: 'Error: Forbidden',
        schema: {
          example: {
            timestamp: '2025-05-27T12:00:19.403Z',
            path: '/trip-length-guide',
            error: 'ADMIN:  You do not have access to this resource.',
          },
        },
      }),
  
      ApiInternalServerErrorResponse({
        description: 'Error: Internal Server Error',
        schema: {
          example: {
            timestamp: '2025-05-27T12:00:48.641Z',
            path: '/trip-length-guide',
          },
        },
      }),
    );
  }
  