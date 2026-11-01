import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Itinerary } from './itinerary.entity';

@Entity('itinerary_features')
@Index(['itinerary_id', 'feature_type']) // optimal querying by itinerary and type
export class ItineraryFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Index() // fast joins, lookups by itinerary_id
  @Column()
  itinerary_id: number;

  @Index() // Useful if querying, filtering by feature_type alone
  @Column({
    type: 'enum',
    enum: ['BUDGET_PLAN', 'PACKING_LIST', 'CUSTOM_ITINERARY']
  })
  feature_type: string;

  @Column('jsonb')
  inputs: Record<string, any>;

  @Column('jsonb')
  content: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Itinerary, itinerary => itinerary.features)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;
}