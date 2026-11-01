import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger';

export function HandlePaymentWebhookSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Handle Razorpay payment webhook (testing only)' }),
    ApiHeader({
      name: 'x-razorpay-signature',
      description: 'Signature for verifying webhook payload from Razorpay',
      required: true,
      schema: { type: 'string' },
    }),
    ApiBody({
      description: 'Webhook payload sent by Razorpay',
      schema: {
        type: 'object',
        example: {
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                id: 'pay_Lxabc123',
                entity: 'payment',
                amount: 100000,
                currency: 'INR',
                status: 'captured',
                order_id: 'order_Lxabc456',
                invoice_id: null,
                international: false,
                method: 'card',
                amount_refunded: 0,
                refund_status: null,
                captured: true,
                email: 'user@example.com',
                contact: '9876543210',
                notes: {},
                fee: 2000,
                tax: 0,
                error_code: null,
                error_description: null,
                created_at: 1716200000,
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Webhook received and processed successfully.',
      schema: {
        example: {
          success: true,
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Invalid webhook signature.' }),
    ApiResponse({ status: 404, description: 'Payment or order not found.' }),
  );
}
