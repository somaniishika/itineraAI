import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Between } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly repo: Repository<Feedback>,
  ) {}

  async countFeedbacksThisMonth(userId: number, startOfMonth: Date): Promise<number> {
    return this.repo.createQueryBuilder('feedback')
      .where('feedback.user_id = :userId', { userId })
      .andWhere('feedback.created_at >= :startOfMonth', { startOfMonth })
      .getCount();
  }

  async findLatestFeedback(userId: number): Promise<Feedback | null> {
    return this.repo.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
  async createAndSave(data: Partial<Feedback>): Promise<Feedback> {
    const feedback = this.repo.create(data);
    return this.repo.save(feedback);
  }
   async getAllFeedbacks(
    page = 1,
    limit = 10,
    rating?: number,
  ): Promise<[Feedback[], number]> {
    const query = this.repo
      .createQueryBuilder('feedback')
      .leftJoin('feedback.user', 'user')
      .addSelect([
        'user.id',
        'user.full_name',
        'user.email',
      ])
      .orderBy('feedback.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (rating) {
      query.andWhere('feedback.rating = :rating', { rating });
    }

    return query.getManyAndCount();
  }
  async decrementFeedbackLimit(feedbackId: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(Feedback)
      .set({
        monthly_feedback_limit: () => 'monthly_feedback_limit - 1',
      })
      .where('id = :feedbackId', { feedbackId })
      .execute();
  }

  async resetAllMonthlyFeedbackLimits(limit: number): Promise<void> {
  await this.repo
    .createQueryBuilder()
    .update()
    .set({ monthly_feedback_limit: limit })
    .execute();
  }
}