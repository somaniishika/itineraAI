import { Injectable, NotFoundException,InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { Faq } from './entities/faq.entity';
import { FaqServiceMessages } from './constants/faq.messages';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { FaqRepository } from './repositories/faq.repository';

@Injectable()
export class FaqService {
constructor(private readonly faqRepository: FaqRepository) {}
 async createFaq(dto: CreateFaqDto): Promise<Faq> {
    
  const normalizedQuestion = dto.question.trim().toLowerCase();
  const existing = await this.faqRepository.findByNormalizedQuestion(normalizedQuestion);
   
  if (existing) {
    const isAnswerChanged = existing.answer !== dto.answer;
    const isCategoryChanged = existing.category !== dto.category;

    if (!isAnswerChanged && !isCategoryChanged) {
      return existing; 
    }

    existing.answer = dto.answer;
    existing.category = dto.category;

    const updatedFaq = await this.faqRepository.update(existing);

    if (!updatedFaq?.id) {
      throw new Error(FaqServiceMessages.INTERNAL_UPDATE_FAIL);
    }

    return updatedFaq;
  }


    const faq = await this.faqRepository.create(dto);

    if (!faq || !faq.id) {
      throw new Error(FaqServiceMessages.INTERNAL_CREATE_FAIL);
    }

    return faq;
  }
   
  
  async deleteFaq(id: number): Promise<void> {
    const faq = await this.faqRepository.findById(id);
    if (!faq) {
      throw new Error(FaqServiceMessages.FAQ_NOT_FOUND(id));
    }

    await this.faqRepository.delete(faq);
  }

   async getAllFaqs(): Promise<Faq[]> {
    const faqs = await this.faqRepository.findAll();
    return faqs;
  }
}
