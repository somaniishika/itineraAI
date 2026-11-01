import {
    ApiQuery,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiInternalServerErrorResponse
  } from '@nestjs/swagger';
  import { applyDecorators } from '@nestjs/common';
  import { FeaturePriceMessages } from '../../constants/feature-management.messages';
  import { FeatureType } from 'src/common/utils/feature-type.enum';
  
  export function GetFeaturePriceSwagger() {
    return applyDecorators(
      ApiOperation({ summary: FeaturePriceMessages.GET_ALL_OR_BY_TYPE_SUMMARY }),
      ApiQuery({
        name: 'type',
        required: false,
        enum: FeatureType,
        description: FeaturePriceMessages.FEATURE_TYPE_DESCRIPTION,
      }),
      ApiOkResponse({
        description: FeaturePriceMessages.FETCH_SUCCESS,
        schema: {
          oneOf: [
            {
              example: {
                success: true,
                message: FeaturePriceMessages.FETCH_SUCCESS,
                data: {
                  featureType: 'ITINERARY',
                  priceAmount: 99.99,
                },
              },
              
            },
            {
              example: {
                success: true,
                message: FeaturePriceMessages.FETCH_SUCCESS,
                data: [],
              },
            
            },
          ],
        },
      }),
      ApiNotFoundResponse({
        description: FeaturePriceMessages.NOT_FOUND,
        schema: {
          example: {
            timestamp: '2025-05-23T08:28:33.613Z',
            path: '/feature-price?type=EMERGENCY_CONTACT',
            error: FeaturePriceMessages.FEATURE_NOT_FOUND,
          },
        },
      }),
      ApiUnauthorizedResponse({
        description: FeaturePriceMessages.UNAUTHORIZED,
        schema: {
          example: {
            timestamp: '2025-05-23T08:11:05.830Z',
            path: '/feature-price?type=ITINERARY',
            error: FeaturePriceMessages.UNAUTHORIZED,
          },
        },
      }),
      ApiInternalServerErrorResponse({
        description: FeaturePriceMessages.INTERNAL_SERVER,
        schema: {
          example: {
            timestamp: '2025-05-23T08:45:00.000Z',
            path: '/feature-price?type=ITINERARY',
            error: FeaturePriceMessages.INTERNAL_SERVER,
          },
        },
      }),
    );
  }
  