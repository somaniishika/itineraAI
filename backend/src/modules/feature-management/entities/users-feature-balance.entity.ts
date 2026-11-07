import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,UpdateDateColumn,} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('user_feature_balances')
export class UserFeatureBalance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column({ type: 'jsonb', default: {} })
  feature_balances!: Record<string, number>;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, user => user.feature_balances)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}