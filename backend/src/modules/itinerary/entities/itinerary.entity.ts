import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { ItineraryFeature } from './itinerary-feature.entity';

@Entity('itineraries')
export class Itinerary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  user_id: number;

  @Column()
  travel_location: string;

  @Column()
  country: string;

  @Column('jsonb')
  content: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ['STANDARD', 'CUSTOM']
  })
  @Index() 
  type: string;

  @Column('jsonb', { nullable: true })
  source_questions_answers: Record<string, any>;

  @CreateDateColumn()
  @Index() // Enable sorting and filtering by creation date
  created_at: Date;

  @ManyToOne(() => User, user => user.itineraries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ItineraryFeature, feature => feature.itinerary)
  features: ItineraryFeature[];
}