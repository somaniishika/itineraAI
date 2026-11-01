import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../entities/faq.entity';
import { CreateFaqDto } from '../dtos/create-faq.dto';

@Injectable()
export class FaqRepository{
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
  ) {}

  async findByQuestion(question: string): Promise<Faq | null> {
    return await this.faqRepo.findOne({ where: { question } });
  }
  async findByNormalizedQuestion(question: string): Promise<Faq | null> {
    return await this.faqRepo
      .createQueryBuilder('faq')
      .where('LOWER(TRIM(faq.question)) = :question', {
        question: question.trim().toLowerCase(),
      })
      .getOne();
  }
  async create(dto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepo.create({
      question: dto.question,
      answer: dto.answer,
      category:dto.category,
    });

    return await this.faqRepo.save(faq);
  }
  async update(faq: Faq): Promise<Faq> {
  return await this.faqRepo.save(faq);
  }
  async findById(id: number): Promise<Faq | null> {
  return await this.faqRepo.findOne({ where: { id } });
  }

  async delete(faq: Faq): Promise<void> {
  await this.faqRepo.remove(faq);
  }
  
  async findAll(): Promise<Faq[]> {
  return await this.faqRepo.find({ order: { created_at: 'ASC' } });
  }

}
