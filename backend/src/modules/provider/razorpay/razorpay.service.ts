import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay = require('razorpay');

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(private config: ConfigService) {
    const keyId     = this.config.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    if (!keyId || !keySecret) {
      throw new Error('Missing Razorpay API credentials');
    }
    this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  
  async createOrder(amount: number) {
    try{
    console.log('Creating Razorpay order with amount:', amount);
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };
    return await this.razorpay.orders.create(options);
  }
    catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create Razorpay order');
    }
  }

  verifySignature(body: any, signature: string, secret: string): boolean {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');
    return expected === signature;
  }
}
