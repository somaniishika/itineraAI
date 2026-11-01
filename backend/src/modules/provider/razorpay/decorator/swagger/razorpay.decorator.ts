import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

export function ApiCreateOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a Razorpay order (Testing only)' }),
    ApiResponse({ status: 201, description: 'Order created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid request' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 500 },
        },
        required: ['amount'],
      },
    }),
  );
}

export function ApiVerifySignature() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify Razorpay payment signature (Testing only)' }),
    ApiResponse({ status: 200, description: 'Signature verification result' }),
    ApiResponse({ status: 400, description: 'Invalid request' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          body: { type: 'object', example: { order_id: 'order_xxx', payment_id: 'pay_xxx' } },
          signature: { type: 'string', example: 'generated_signature_here' },
          secret: { type: 'string', example: 'your_razorpay_key_secret' },
        },
        required: ['body', 'signature', 'secret'],
      },
    }),
  );
}
