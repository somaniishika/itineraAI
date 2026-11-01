import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiOperation,ApiNotFoundResponse,ApiOkResponse,ApiUnauthorizedResponse,ApiInternalServerErrorResponse,ApiForbiddenResponse,ApiBadRequestResponse} from '@nestjs/swagger';

export function GetItineraryByIdSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get Itinerary by ID',
      description: `
Fetches a single Itinerary resource identified by its numeric ID.

**Usage Notes:**
- Provide a valid numeric ID in the URL path.
- Returns 200 with the entity details on success.
- Handles typical error responses for authorization, validation, and not found scenarios.
      `,
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the entity',
      example: 123,
      type: Number,
    }),
    ApiOkResponse({
      description: 'Fetched itinerary successfully',
      schema: {
        example: {
          id: 10,
          travel_location: 'Kochi',
          country: 'India',
          type: 'STANDARD',
          created_at: '2025-06-04T03:24:31.152Z',
          content: {
            days: [
              {
                day: '1',
                tags: ['arrival', 'history', 'culture'],
                day_title: 'Arrival in Kochi and Historical Exploration',
                activities: [
                  {
                    cost: '2500 INR (30 USD)',
                    time: '14:00',
                    title: 'Arrival at Cochin International Airport (COK) and Transfer to Fort Kochi',
                    duration: '1.5 hours',
                    description:
                      "Arrive at Cochin International Airport and transfer to your hotel in Fort Kochi by pre-booked private car. Enjoy the scenic drive.",
                  },
                  {
                    cost: '10000-12000 INR (120-145 USD)',
                    time: '15:30',
                    title: 'Check-in at Brunton Boatyard (5-Star Hotel)',
                    duration: '30 minutes',
                    description:
                      "Check in to Brunton Boatyard, a heritage hotel offering a glimpse into Kochi's colonial past.",
                  },
                ],
              },
              {
                day: '2',
                tags: ['culture', 'spices', 'history'],
                day_title: 'Kochi Culture and Spice Route',
                activities: [
                  {
                    cost: '5 INR (0.06 USD)',
                    time: '09:00',
                    title: 'Mattancherry Palace (Dutch Palace)',
                    duration: '2 hours',
                    description:
                      'Visit Mattancherry Palace, showcasing Kerala murals depicting Hindu temple art, portraits, and exhibits of the Rajas of Kochi.',
                  },
                ],
              },
            ],
            country_name: 'India',
            itinerary_title: "10 Days of Kerala's Nature, Culture, and Wellness",
            user_travel_location: 'Kerala',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-04T10:18:37.699Z',
          path: '/itinerary/1',
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
              timestamp: '2025-06-04T10:19:14.398Z',
              path: '/itinerary/2',
              error: 'ADMIN:  You do not have access to this resource.',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T11:02:04.037Z',
              path: '/itinerary/10',
              error: 'You are not authorized to view this itinerary',
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-04T10:19:51.701Z',
          path: '/itinerary/2',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-04T10:20:07.464Z',
          path: '/itinerary/1',
          error: 'Itinerary not found',
        },
      },
    }),
  );
}
