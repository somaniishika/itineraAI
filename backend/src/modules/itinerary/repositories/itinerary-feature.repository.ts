import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ItineraryFeature } from '../entities/itinerary-feature.entity';
import { type } from 'os';

@Injectable()
export class ItineraryFeatureRepository {
  private readonly repository: Repository<ItineraryFeature>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ItineraryFeature);
  }

  createFeature(data: Partial<ItineraryFeature>): ItineraryFeature {
    return this.repository.create(data);
  }

  async saveFeature(feature: ItineraryFeature): Promise<ItineraryFeature> {
    return this.repository.save(feature);
  }

  async findFeaturesByItinerary(itineraryId: number): Promise<ItineraryFeature[]> {
    return this.repository.find({
      where: { itinerary_id: itineraryId },
      order: { created_at: 'DESC' },
    });
  }


   async findByItineraryId(
  itineraryId: number,
  featureType: 'BUDGET_PLAN' | 'PACKING_LIST' | 'CUSTOM_ITINERARY',
  page = 1,
  limit = 10,
): Promise<{ data: ItineraryFeature[]; total: number }> {
  const [data, total] = await this.repository.findAndCount({
    where: {
      itinerary_id: itineraryId,
      feature_type: featureType,
    },
    order: { created_at: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { data, total };
}
 async findOneByItineraryAndFeatureId(itineraryId: number, featureId: number): Promise<ItineraryFeature | null> {
    return this.repository.findOne({
      where: {
        itinerary_id: itineraryId,
        id: featureId,
      },
    });
  }
}
  
