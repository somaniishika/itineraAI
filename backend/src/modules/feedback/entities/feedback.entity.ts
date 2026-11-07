import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';

type FeedbackImage = {
  url: string;
  alt?: string;
};

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column('int')
  @Index() // for rating based filtering
  rating!: number;

  @Column('text', { nullable: true })
  message!: string;

  @Column({ type: 'jsonb', nullable: true })
  images?: FeedbackImage[];

  @Column({ default: 5 })
  monthly_feedback_limit!: number;

  @CreateDateColumn()
  @Index() // filtering/sorting
  created_at!: Date;

  @ManyToOne(() => User, user => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}