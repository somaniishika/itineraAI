import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureOrder } from '../entities/feature-order.entity';

@Injectable()
export class FeatureOrderRepository {
  constructor(
    @InjectRepository(FeatureOrder)
    private readonly featureOrderRepo: Repository<FeatureOrder>,
  ) {}

  async createFeatureOrder(data: Partial<FeatureOrder>) {
    const order = this.featureOrderRepo.create(data);
    return this.featureOrderRepo.save(order);
  }
  
  async findOne(orderId: string): Promise<FeatureOrder | null> {
    return this.featureOrderRepo.findOne({
      where: { order_id: orderId }
    });
  }
}