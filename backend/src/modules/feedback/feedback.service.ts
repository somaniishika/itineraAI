import {Injectable,BadRequestException,InternalServerErrorException} from '@nestjs/common';
import { FeedbackRepository } from './repositories/feedback.repository';
import { CreateFeedbackDto } from './dto/submit-feedback.dto';
import { FeedbackConstants, FeedbackMessages } from './constants/feedback.constants';
import { UserRepository } from '../users/repositories/users.repository';
import { Feedback } from './entities/feedback.entity';
import { ImageService } from '../image/image.service';

export interface PaginatedFeedbackResult {
  data: Feedback[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
    private readonly imageService: ImageService
  ) {}

  async submitFeedback(userId: number, dto: CreateFeedbackDto): Promise<Feedback> {
  try {
    const maxLimit = FeedbackConstants.DEFAULT_MONTHLY_LIMIT;

    const latestFeedback = await this.feedbackRepo.findLatestFeedback(userId);

    const currentLimit = latestFeedback ? latestFeedback.monthly_feedback_limit : maxLimit;

    if (currentLimit <= 0) {
      throw new BadRequestException(
        `${FeedbackMessages.LIMIT_REACHED} (${maxLimit})`,
      );
    }

    const newLimit = currentLimit - 1;

    const feedback = await this.feedbackRepo.createAndSave({
      user_id: userId,
      rating: dto.rating,
      message: dto.message,
      images: dto.images,
      monthly_feedback_limit: newLimit,
    });

    if (dto.images?.length) {
      console.log('Marking images as used:', dto.images);
      const urls = dto.images.map((img) => img.url);
      console.log('Converted image URLs to mark as used:', urls);
      await this.imageService.markImagesAsUsedByUrls(urls);
    }

    return feedback;
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new InternalServerErrorException(FeedbackMessages.SUBMISSION_FAILED);
  }
}

async getAllFeedbacks(
    page: number,
    limit: number,
    rating?: number,
  ): Promise<PaginatedFeedbackResult> {
    try {
      const [feedbacks, total] = await this.feedbackRepo.getAllFeedbacks(
        page,
        limit,
        rating,
      );

      return {
        data: feedbacks,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch feedbacks');
    }
  }
}