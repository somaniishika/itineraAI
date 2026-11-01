import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Itinerary } from '../entities/itinerary.entity';

@Injectable()
export class ItineraryRepository {
  private readonly repository: Repository<Itinerary>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Itinerary);
  }

  async findLatestByUser(userId: number): Promise<Itinerary | null> {
    return this.repository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  createItinerary(data: Partial<Itinerary>): Itinerary {
    return this.repository.create(data);
  }

  async saveItinerary(itinerary: Itinerary): Promise<Itinerary> {
    return this.repository.save(itinerary);
  }
  async findUserItineraries(userId: number, page: number, limit: number): Promise<{ items: any[]; total: number }> {
    const query = this.repository
      .createQueryBuilder('itinerary')
      .select([
        'itinerary.id',
        'itinerary.travel_location AS travel_location',
        'itinerary.country AS country',
        'itinerary.type AS type',
        'itinerary.created_at AS created_at',
        `itinerary.content ->> 'itinerary_title' AS title`,
      ])
      .where('itinerary.user_id = :userId', { userId })
      .orderBy('itinerary.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
  
    const items = await query.getRawMany();
  
    const total = await this.repository
      .createQueryBuilder('itinerary')
      .where('itinerary.user_id = :userId', { userId })
      .getCount();
  
    return { items, total };
  }
  
  async findItineraryById(itineraryId: number): Promise<Itinerary | null> {
  return this.repository.findOne({
    where: { id: itineraryId },
  });
}

   async updateItinerary(itineraryId: number, data: Partial<Itinerary>): Promise<void> {
    await this.repository.update(itineraryId, data);
  }

  
}
