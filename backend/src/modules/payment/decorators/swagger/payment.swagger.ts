import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { PaymentServiceMessages } from '../../constants/payment.messages';

export function ApiGetAllPaymentsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get payment history — Admin only',
      description: 'Retrieves a paginated list of all user payment transactions, including status, total amount, and associated user and order details. Only accessible to admin.',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 10)',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      description: 'Filter by payment status',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search by user name or email',
    }),

    ApiOkResponse({
      description: PaymentServiceMessages.PAYMENTS_RETRIEVED_SUCCESS,
      schema: {
        example: {
          success: true,
          message: 'Payments retrieved successfully',
          data: {
            data: [
              {
                id: 113,
                transaction_id: null,
                status: 'PENDING',
                total_amount: '35.00',
                created_at: '2025-06-05T00:02:18.513Z',
                user: {
                  id: 26,
                  username: 'Ishikai',
                  email: 'Ishika25somania@gmail.com',
                },
                order: {
                  order_id: 'order_QdOsf2i7UrOyCX',
                  feature_credits: {
                    ITINERARY: 2,
                    PACKING_LIST: 1,
                  },
                  feature_prices: {
                    ITINERARY: 10,
                    PACKING_LIST: 15,
                  },
                  total_amount: '35.00',
                },
              },
            ],
            pagination: {
              currentPage: 1,
              limit: 10,
              totalRecords: 1,
              totalPages: 1,
            },
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T09:31:51.630Z',
          path: '/payments?page=1&limit=10',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: PaymentServiceMessages.FORBIDDEN,
      schema: {
        example: {
          timestamp: '2025-06-05T09:32:39.861Z',
          path: '/payments?page=1&limit=10',
          error: 'USER:  You do not have access to this resource.',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[{
          example: {
            timestamp: '2025-06-05T09:37:50.512Z',
            path: '/payments?page=1&limit=1&search=123245',
          },
        },
        {
          example: {
            timestamp: '2025-06-05T09:37:50.512Z',
            path: '/payments?page=1&limit=1&search=123245',
            error:'An unexpected error occurred.'
          },
        }
      ]
       
      },
    }),
  );
}
