import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth ,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export function GetEmergencyContactsSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get emergency contacts by location',
      description:
        'Retrieves cached or AI-generated emergency contact details for a given location. Sends an email notification with the retrieved data.',
    }),
    ApiBearerAuth('access-token'),
    
    // Success Response
    ApiResponse({
      status: 200,
      description: 'Emergency contacts retrieved successfully (cached or generated).',
      schema: {
        example: {
          statusCode: 200,
          message: 'Emergency contacts retrieved successfully.',
          data: {
            location: 'Mumbai, India',
            emergency_contacts: [
              {
                name: 'Mumbai Police Control Room',
                contact: '+91-22-2262-0111',
                type: 'police',
              },
              {
                name: 'KEM Hospital Emergency',
                contact: '+91-22-2410-7000',
                type: 'hospital',
              },
              {
                name: 'Mumbai Fire Brigade',
                contact: '+91-22-2262-1234',
                type: 'fire',
              },
            ],
            generated_at: '2025-05-27T10:30:00.000Z',
            source: 'AI', // or 'cache'
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Emergency contacts generated and stored successfully.',
      schema: {
        example: {
          statusCode: 201,
          message: 'Emergency contacts generated and stored.',
          data: {
            location: 'Mumbai, India',
            emergency_contacts: [
              {
                name: 'Mumbai Police Control Room',
                contact: '+91-22-2262-0111',
                type: 'police',
              },
              {
                name: 'KEM Hospital Emergency',
                contact: '+91-22-2410-7000',
                type: 'hospital',
              },
              {
                name: 'Mumbai Fire Brigade',
                contact: '+91-22-2262-1234',
                type: 'fire',
              },
            ],
            generated_at: '2025-05-27T10:30:00.000Z',
            source: 'AI',
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T10:32:38.101Z',
          path: '/emergency-details',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T10:33:03.986Z',
          path: '/emergency-details',
          error: 'ADMIN:  You do not have access to this resource.',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T10:39:36.328Z',
              path: '/emergency-details',
              error: [
                'location must be a string',
                'location should not be empty',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T10:39:54.141Z',
              path: '/emergency-details',
              error:
                "Expected ',' or '}' after property value in JSON at position 24",
            },
          },
        ],
      },
    }),
    // Not Found
    ApiNotFoundResponse({
      description: 'Error: Not Found.',
      schema: {
        example: {
          timestamp: '2025-06-05T10:39:54.141Z',
          path: '/emergency-details',
          error: 'Not Found',
        },
      },
    }),

    // Internal Server Error
    
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        example: {
          timestamp: '2025-06-05T10:39:04.789Z',
          path: '/emergency-details',
          error:
            'Something went wrong while retrieving emergency contacts.',
        },
      },
    }),
  );
}
