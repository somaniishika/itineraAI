import { Controller, Post, Body } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateOrder, ApiVerifySignature } from './decorator/swagger/razorpay.decorator';

@ApiTags('Razorpay')
@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  // Both the apis are made for testing razorpay service

  @Post('create-order')
  @ApiCreateOrder()
  async createOrder(@Body('amount') amount: number) {
    const order = await this.razorpayService.createOrder(amount);
    return {
      message: 'Order created successfully',
      order,
    };
  }

  @Post('verify-signature')
  @ApiVerifySignature()
  verifySignature(
    @Body('body') body: any,
    @Body('signature') signature: string,
    @Body('secret') secret: string,
  ) {
    const isValid = this.razorpayService.verifySignature(body, signature, secret);
    return {
      isValid,
    };
  }
}
