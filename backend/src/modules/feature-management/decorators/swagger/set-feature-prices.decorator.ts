import {ApiOperation,ApiOkResponse,ApiInternalServerErrorResponse,ApiBadRequestResponse,ApiBody,ApiQuery,ApiUnauthorizedResponse,ApiForbiddenResponse} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { FeaturePriceDto } from '../../dtos/set-feature-price.dto';
import { FeaturePriceMessages } from '../../constants/feature-management.messages';
import { FeatureType } from 'src/common/utils/feature-type.enum';

export function SwaggerUpdateFeaturePrices() {
  return applyDecorators(
    ApiOperation({ summary: 'Set feature price for one feature (Admin only)' }),

    ApiQuery({
      name: 'featureType',
      enum: FeatureType,
      required: true,
      description: 'Feature type to update (must be one of the enum values)',
      example: FeatureType.ITINERARY,
    }),

    ApiBody({
      type: FeaturePriceDto,
      required: true,
      description: 'Feature pricing details to update (excluding `featureType`, which comes from query)',
      examples: {
        singleFeaturePrice: {
          summary: 'Single feature price example',
          value: {
            priceAmount: 10,
            currency: 'INR',
          },
        },
      },
    }),
 ApiOperation({
      summary: 'Set feature pricing — Admin only',
      description:
        'Sets or updates the pricing details for a specific feature type. Only accessible by admins.',
    }),
    ApiOkResponse({
      description: 'Feature Price set successfully',
      schema: {
        example: {
          success: true,
          message: 'Feature Price set successfully',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T03:40:31.905Z',
          path: '/feature-prices?featureType=ITINERARY',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          timestamp: '2025-06-05T03:42:03.381Z',
          path: '/feature-prices?featureType=ITINERARY',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T03:42:44.218Z',
              path: '/feature-prices?featureType=ITINERARY',
              error: 'Validation failed: Bad Request',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T03:44:26.215Z',
              path: '/feature-prices?featureType=ITINERARY',
              error:
                "Expected ',' or '}' after property value in JSON at position 43 (line 4 column 1)",
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error ',
       schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T03:45:21.350Z',
              path: '/feature-prices?featureType=ITINERARY',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T03:45:21.350Z',
              path: '/feature-prices?featureType=ITINERARY',
              error: 'Failed to update feature price',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T03:45:21.350Z',
              path: '/feature-prices?featureType=ITINERARY',
              error: 'Unexpected error occurred while updating feature price',
            },
          },
        ],
      },
    }),
  );
}
