import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from '../../dto/create-order.dto';

export function InitiatePaymentSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Initiate a Razorpay order',
      description:
        'Creates a Razorpay order with the given feature credits. Returns the order ID, amount, and Razorpay key.',
    }),

    ApiBody({
      type: CreateOrderDto,
      description:
        'Provide the feature categories and number of credits you want to purchase',
      examples: {
        example1: {
          summary: 'Purchase credits for multiple features',
          value: {
            featureCredits: [
              { feature: 'ITINERARY', credits: 2 },
              { feature: 'PACKING_LIST', credits: 1 },
            ],
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Razorpay order created successfully',
      schema: {
        example: {
          success: true,
          orderId: 'order_QdOsf2i7UrOyCX',
          amount: 35,
          razorpayKey: 'rzp_test_r71IHnPgJNkLP2',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T05:30:56.827Z',
          path: '/initiate',
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
              timestamp: '2025-06-05T05:31:41.322Z',
              path: '/initiate',
              error: 'ADMIN:  You do not have access to this resource.',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T05:31:41.322Z',
              path: '/initiate',
              error: 'No active feature prices found in the system.',
            },
          },
        ],
      },
    }),

    ApiBadRequestResponse({
      description: 'Error: Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T05:32:58.746Z',
              path: '/initiate',
              error:
                "Expected ',' or '}' after property value in JSON at position 154 (line 12 column 1)",
            },
          },
          {
            example: {
              timestamp: '2025-06-05T05:34:27.608Z',
              path: '/initiate',
              error: [
                'featureCredits.0.feature must be one of the following values: ITINERARY, BUDGET_PLAN, PACKING_LIST, CUSTOM_ITINERARY, TRIP_GUIDE',
                'featureCredits.1.feature must be one of the following values: ITINERARY, BUDGET_PLAN, PACKING_LIST, CUSTOM_ITINERARY, TRIP_GUIDE',
              ],
            },
          },
        ],
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[
          {example: 
            {
          timestamp: '2025-06-05T05:32:38.956Z',
          path: '/initiate'
        },
      },
          {example: 
            {
          timestamp: '2025-06-05T05:32:38.956Z',
          path: '/initiate',
          error: 'Failed to create feature order',
        },
      },
      {example: 
        {
      timestamp: '2025-06-05T05:32:38.956Z',
      path: '/initiate',
      error: 'Failed to create payment',
    },
  },


      ]
      
      },
    }),
  );
}
