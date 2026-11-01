import { Controller, Get, Query, HttpStatus, Res, UseGuards, Post, Req, Body, Headers, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiGetAllPaymentsDocs } from './decorators/swagger/payment.swagger';
import { PaymentService } from './payment.service';
import { GetPaymentsQueryDto } from './dto/get-payment-query.dto';
import { PaymentServiceMessages } from './constants/payment.messages';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { RazorpayService } from '../provider/razorpay/razorpay.service';
import { InitiatePaymentSwagger } from './decorators/swagger/initiate-payment.decorator';
import { HandlePaymentWebhookSwagger } from './decorators/swagger/payment-webhook.decorator';

@ApiTags('Payments')
@Controller()
@ApiBearerAuth('access-token')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly razorpayService: RazorpayService
  ) { }

  @Get('payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiGetAllPaymentsDocs()
  async getAllPayments(
  @Query() queryDto: GetPaymentsQueryDto,
  @Res() res: Response,) 
  {
  try {
    const result = await this.paymentService.getAllPayments(queryDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: PaymentServiceMessages.PAYMENTS_RETRIEVED_SUCCESS,
      data: result,
    });
  } catch (error) {
    throw new InternalServerErrorException(PaymentServiceMessages.UNEXPECTED_ERROR);
    }
  }

  @Post('initiate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @InitiatePaymentSwagger()
  async initiatePayment(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const userId = (req.user as any)?.id;

    try {
      const response = await this.paymentService.initiatePayment(userId, dto);
      return response;
    } catch (error) {
      const message = error.message;

      switch (message) {
        case PaymentServiceMessages.NO_ACTIVE_PRICING:
          throw new NotFoundException(message);
        case PaymentServiceMessages.FAILED_TO_CREATE_ORDER:
        case PaymentServiceMessages.FAILED_TO_CREATE_PAYMENT:
          throw new InternalServerErrorException(message);
        default:
          throw new InternalServerErrorException(message);
      
    }
  }
}

@Post('webhook')
@HandlePaymentWebhookSwagger()
async handleWebhook(
  @Body() body: any,
  @Headers('x-razorpay-signature') signature: string,
) {
  const verified = this.razorpayService.verifySignature(
    body,
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET!,
  );

  if (!verified) {
    throw new UnauthorizedException(PaymentServiceMessages.INVALID_SIGNATURE);
  }

  const { order_id, status, id: transaction_id } = body.payload.payment.entity;

  try {
    await this.paymentService.processPaymentResult(order_id, status, transaction_id, body);
    return { success: true };
  } catch (error) {
    switch (error.message) {
      case PaymentServiceMessages.PAYMENT_NOT_FOUND:
      case PaymentServiceMessages.ORDER_NOT_FOUND:
        throw new NotFoundException(error.message);
      case PaymentServiceMessages.PAYMENT_PROCESSING_FAILED:
        throw new InternalServerErrorException(error.message);
      default:
        throw error;
    }
  }
}

}
