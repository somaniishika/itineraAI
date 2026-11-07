import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('trip_length_guides')
export class TripLengthGuide {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index()
  user_id!: number;

  @Column('varchar')
  location!: string;

  @Column('jsonb')
  content!: Record<string, string>;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User, user => user.trip_guides)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}