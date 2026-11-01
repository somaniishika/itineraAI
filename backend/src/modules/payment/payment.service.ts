import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { GetPaymentsQueryDto } from './dto/get-payment-query.dto';
import { FeatureOrderRepository } from './repositories/feture-order.repository';
import { CreateOrderDto, FeatureCreditDto } from './dto/create-order.dto';
import { FeatureManagementService } from '../feature-management/feature-management.service';
import { PaymentServiceMessages } from './constants/payment.messages';
import { RazorpayService } from '../provider/razorpay/razorpay.service';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository
    , private readonly featureOrderRepo :FeatureOrderRepository,
    private readonly featureManagementService: FeatureManagementService,
    private readonly razorpayService: RazorpayService
  ) {}


  async getAllPayments(query: GetPaymentsQueryDto) {
    return this.paymentRepository.getPaginatedPayments(query);
  }

  async initiatePayment(userId: string, dto: CreateOrderDto) {
  const result = await this.featureManagementService.calculateOrderAmount(dto.featureCredits);

  const razorpayOrder = await this.razorpayService.createOrder(result.totalAmount);

  console.log(`Razorpay order created: ${JSON.stringify(razorpayOrder)}`);
  await this.createOrderAndPayment(Number(userId), dto.featureCredits, result, razorpayOrder);

  return {
    success: true,
    orderId: razorpayOrder.id,
    amount: result.totalAmount,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  };
}


  async createOrderAndPayment(
    userId: number,
    featureCredits: FeatureCreditDto[],
    result: { totalAmount: number; breakdown: any },
    razorpayOrder: any,
  ) {

    const featureCreditsRecord: Record<string, number> = featureCredits.reduce((acc, item) => {
      acc[item.feature] = item.credits;
      return acc;
    }, {});

    // create feature order and saving it to DB
    const newFeatureOrder = await this.featureOrderRepo.createFeatureOrder({
      user_id: userId,
      order_id: razorpayOrder.id, // use Razorpay order id
      feature_credits: featureCreditsRecord,
      feature_prices: result.breakdown.reduce((acc, item) => {
        acc[item.feature] = item.pricePerCredit;
        return acc;
      }, {}),
      total_amount: result.totalAmount,
    });


    if (!newFeatureOrder) {
      throw new Error(PaymentServiceMessages.FAILED_TO_CREATE_ORDER);
    }

    // create payment
    const newPayment = await this.paymentRepository.createPayment({
      user_id: userId,
      order_id: razorpayOrder.id,  
      total_amount: result.totalAmount,
      transaction_id: undefined, 
      status: 'PENDING',
      payment_gateway_response: {}, 
    });

    if (!newPayment) {
      throw new Error(PaymentServiceMessages.FAILED_TO_CREATE_PAYMENT);
    }

    return { order: newFeatureOrder, payment: newPayment };
  }

  async processPaymentResult(orderId: string, status: string, transactionId: string, payload: any) {
    try {
    const payment = await this.paymentRepository.findOne(orderId);
    if (!payment) throw new Error(PaymentServiceMessages.PAYMENT_NOT_FOUND);
  
    payment.status = status === 'captured' ? 'SUCCESS' : 'FAILED';
    payment.transaction_id = transactionId;
    payment.payment_gateway_response = payload;
    await this.paymentRepository.save(payment);

    console.log(`Payment entry updated, successfully received payment confirmation from Razorpay for order ${orderId}, transaction: ${transactionId}, payment_gateway_response: ${JSON.stringify(payload)}`);
  
    if (payment.status === 'SUCCESS') {
      const order = await this.featureOrderRepo.findOne(orderId);
      if (!order) throw new Error(PaymentServiceMessages.ORDER_NOT_FOUND);
      await this.featureManagementService.creditMultipleFeaturesToUser(
        order.user_id,
        order.feature_credits
      );
    }
  } catch (error) {
      if (
        error.message === PaymentServiceMessages.PAYMENT_NOT_FOUND ||
        error.message === PaymentServiceMessages.ORDER_NOT_FOUND
      ) {
        throw error;
      }

      console.error('Webhook payment processing failed:', error);
      throw new Error(PaymentServiceMessages.PAYMENT_PROCESSING_FAILED);
  }
  }
  

}
