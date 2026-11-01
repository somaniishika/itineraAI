import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SuspensionRequest } from '../entities/suspension-request.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SuspensionRequestRepository {
  constructor(
    @InjectRepository(SuspensionRequest)
    private readonly suspensionRepo: Repository<SuspensionRequest>,
  ) { }

  async findByUserId(userId: number): Promise<SuspensionRequest | null> {
    return this.suspensionRepo.findOne({
      where: { user_id: userId },
    });
  }

  async save(suspensionRequest: SuspensionRequest): Promise<SuspensionRequest> {
    return this.suspensionRepo.save(suspensionRequest);
  }

  async create(data: Partial<SuspensionRequest>): Promise<SuspensionRequest> {
    const newRequest = this.suspensionRepo.create(data);
    return this.suspensionRepo.save(newRequest);
  }

  async findAll(): Promise<SuspensionRequest[]> {
    return this.suspensionRepo.find();
  }

  async deleteById(id: number): Promise<void> {
    await this.suspensionRepo.delete(id);
  }

  async createRequest(userId: number, reason: string): Promise<void> {
    const existingRequest = await this.suspensionRepo.findOne({ where: { user_id: userId } });

    if (existingRequest) {
      // Update the existing request
      existingRequest.suspension_reason = reason;
      existingRequest.status = 'PENDING';
      existingRequest.user_request_message = null;

      await this.suspensionRepo.save(existingRequest);
    } else {
      // Create a new request
      const newRequest = this.suspensionRepo.create({
        user_id: userId,
        suspension_reason: reason,
        status: 'PENDING',
        user_request_message: null,
      });

      await this.suspensionRepo.save(newRequest);
    }
  }

  async reactivateUserRequest(userId: number): Promise<void> {
    const request = await this.suspensionRepo.findOne({
      where: { user_id: userId },
    });

    if (!request) {
      throw new Error(`SUSPENSION_REQUEST_NOT_FOUND:${userId}`);
    }
    request.status = 'APPROVED';
    await this.suspensionRepo.save(request);
  }

  async findPaginatedAndFiltered(
    page: number,
    limit: number,
    status?: 'PENDING' | 'APPROVED',
  ): Promise<{ data: SuspensionRequest[]; total: number }> {
    const queryBuilder = this.suspensionRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .orderBy('request.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('request.status = :status', { status });
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

}
