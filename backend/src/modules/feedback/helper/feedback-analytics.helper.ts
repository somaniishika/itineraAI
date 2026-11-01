import { Repository,Between } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';

export async function fetchFeedbackAnalytics(
  repo: Repository<Feedback>,
  [start, end]: [Date, Date],
) {
  const [total, avg, dist] = await Promise.all([
    repo.count({ where: { created_at: Between(start, end) } }),
    repo.createQueryBuilder('feedback')
      .select('AVG(feedback.rating)', 'avgRating')
      .where('feedback.created_at BETWEEN :start AND :end', { start, end })
      .getRawOne(),
    
      repo.createQueryBuilder('feedback')
      .select('rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('feedback.created_at BETWEEN :start AND :end', { start, end })
      .groupBy('rating')
      .orderBy('rating', 'ASC')
      .getRawMany(),
  ]);

  return {
    totalFeedbacks: total,
    averageRating: avg.avgRating ? +(+avg.avgRating).toFixed(2) : 0,
    ratingDistribution: dist,  //how many times each rating was given during the period.
  };
}