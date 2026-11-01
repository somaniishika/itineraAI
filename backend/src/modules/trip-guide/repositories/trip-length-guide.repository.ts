import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripLengthGuide } from '../entities/trip-length-guide.entity';

@Injectable()
export class TripLengthGuideRepository {
  constructor(
    @InjectRepository(TripLengthGuide)
    private readonly repository: Repository<TripLengthGuide>,
  ) {}

  async create(data: Partial<TripLengthGuide>): Promise<TripLengthGuide> {
    const guide = this.repository.create(data);
    return this.repository.save(guide);
  }

  async findUserTripGuides(userId: number, page: number, limit: number): Promise<{ items: any[]; total: number }> {
    const offset = (page - 1) * limit;
  
    const rawQuery = this.repository
      .createQueryBuilder('guide')
      .leftJoin('guide.user', 'user')
      .where('guide.user_id = :userId', { userId })
      .orderBy('guide.created_at', 'DESC')
      .offset(offset)
      .limit(limit)
      .select([
        'guide.id AS guide_id',
        'guide.location AS location',
        `guide.content ->> 'recommended_stay' AS recommended_stay`,
        `guide.content ->> 'final_tip' AS final_tip`,
        'user.id AS user_id',
        'user.username AS username',
        'user.email AS email',
        'guide.created_at AS created_at',
      ]);
  
    const items = await rawQuery.getRawMany();
  
    const total = await this.repository
      .createQueryBuilder('guide')
      .where('guide.user_id = :userId', { userId })
      .getCount();
  
    return { items, total };
  }
  

  async findById(id: number): Promise<any> {
    const trip=await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!trip) return null;

    const { user, ...rest } = trip;
    return rest;
  }

  async findByUserAndLocation(userId: number, location: string): Promise<TripLengthGuide | null> {
    return this.repository.findOne({
      where: { 
        user_id: userId, 
        location: location.trim().toLowerCase() 
      },
      order: { created_at: 'DESC' },
    });
  }
}