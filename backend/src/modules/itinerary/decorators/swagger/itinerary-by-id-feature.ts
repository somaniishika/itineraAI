import { ApiOkResponse,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiNotFoundResponse,ApiInternalServerErrorResponse,ApiOperation} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function SwaggerGetFeaturesByItineraryId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get budget plans or packing lists for a given itinerary ID (with pagination)',
    }),

    ApiOkResponse({
      description: 'Budget plans or packing lists fetched successfully',
      schema: {
        example: {
          total: 2,
          page: 1,
          limit: 10,
          data: [
            {
              id: 44,
              budget_type: 'Standard',
              user_travel_location: 'Indore, India',
            },
            {
              id: 7,
              budget_type: 'Standard',
              user_travel_location: 'Indore, India',
            },
          ],
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'User is not authenticated',
      schema: {
        example: {
          timestamp: '2025-06-05T10:30:53.297Z',
          path: '/itinerary/features',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'User is forbidden from accessing this resource',
      schema: {
        example: {
          timestamp: '2025-06-05T10:31:54.443Z',
          path: '/itinerary/features',
          error: 'ADMIN: You do not have access to this resource.',
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Itinerary not found',
      schema: {
        example: {
          timestamp: '2025-06-05T10:32:20.067Z',
          path: '/itinerary/features',
          error: 'Itinerary not found',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          timestamp: '2025-06-05T10:33:26.312Z',
          path: '/itinerary/features',
          error: 'Internal server error',
        },
      },
    }),
  );
  
}


export function SwaggerGetFeatureById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get detailed feature content by itineraryId and featureId' }),
    ApiOkResponse({
      description: 'Feature fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Feature fetched successfully',
          data: {
            id: 44,
            itinerary_id: 1,
            feature_type: 'BUDGET_PLAN',
            inputs: {
              travelers: 2,
              preferences: ['history', 'food'],
            },
            content: {
              currency: '₹ INR',
              budget_type: 'Standard',
              user_travel_location: 'Indore, India',
              total_budget_estimate: '₹27500 (330 USD)',
              per_day_summary: [/* ... */],
              budget_breakdown: { /* ... */ },
              currency_conversion: '1 USD = ₹83.5',
            },
            created_at: '2025-06-05T12:00:00.000Z',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T10:30:53.297Z',
          path: '/itinerary/:itineraryId/features/:featureId',
          error: 'Unauthorized',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Feature not found',
      schema: {
        example: {
          timestamp: '2025-06-05T10:32:20.067Z',
          path: '/itinerary/:itineraryId/features/:featureId',
          error: 'Feature not found for this itinerary.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          timestamp: '2025-06-05T10:33:26.312Z',
          path: '/itinerary/:itineraryId/features/:featureId',
          error: 'Internal server error',
        },
      },
    }),
  );
}