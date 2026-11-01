import { ApiOperation, ApiQuery,ApiOkResponse,ApiForbiddenResponse,ApiInternalServerErrorResponse,ApiBearerAuth,ApiUnauthorizedResponse} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetUserItinerariesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get list of user-generated itineraries',
      description: `Returns a paginated list of itineraries created by the logged-in user.
Each item includes travel location, country, type, created date, and a title extracted from content.`,
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Itineraries fetched successfully.',
      schema: {
        example: {
          data: [
            {
              itinerary_id: 14,
              travel_location: 'Andaman and Nicobar Islands',
              country: 'India',
              type: 'STANDARD',
              created_at: '2025-06-04T04:24:22.243Z',
              title: '10 Days of Andaman Serenity: Nature, Culture & Wellness',
            },
            {
              itinerary_id: 13,
              travel_location: 'Andaman and Nicobar Islands',
              country: 'India',
              type: 'STANDARD',
              created_at: '2025-06-04T04:17:18.823Z',
              title: '10 Days of Island Serenity: Andaman & Nicobar Exploration',
            }
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 6,
            totalPages: 1,
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-04T09:23:29.908Z',
          path: '/itinerary/list?page=1&limit=10',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-04T09:24:37.891Z',
          path: '/itinerary/list?page=1&limit=10',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-04T10:01:05.091Z',
              path: '/itinerary/list?page=1&limit=100',
            },
          },
          {
            example: {
              timestamp: '2025-06-04T10:02:12.991Z',
              path: '/itinerary/list?page=2&limit=20',
              error: 'Failed to fetch user itineraries',
            },
          },
        ],
      },
    })
  );
}
