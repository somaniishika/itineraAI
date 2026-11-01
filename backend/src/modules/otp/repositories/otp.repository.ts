import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';
import { CreateOtpDto } from '../dto/create-otp.dto';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  async createOtp(createOtpDto: CreateOtpDto): Promise<Otp> {
    const otp = this.otpRepository.create(createOtpDto);
    return await this.otpRepository.save(otp);
  }

  async findOtpByUserAndPurpose(userId: number, purpose: string): Promise<Otp | null> {
    return await this.otpRepository.findOne({
      where: { user_id: userId, purpose }
    });
  }

  async save(otp: Otp): Promise<Otp> {
    return await this.otpRepository.save(otp);
  }

  async delete(id: number): Promise<void> {
  await this.otpRepository.delete(id);
}
  
}
