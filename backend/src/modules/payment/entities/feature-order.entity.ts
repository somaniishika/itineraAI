import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,CreateDateColumn, Index} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('features_orders')
export class FeatureOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    default: () => 'uuid_generate_v4()',
  })
  @Index({ unique: true })
  order_id: string;

  @Column()
  @Index() 
  user_id: number;
  
  @Column({ type: 'jsonb', default: () => "'{}'" })
  feature_credits: Record<string, number>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  feature_prices: Record<string, number>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  created_at: Date;

  @ManyToOne(() => User, user => user.feature_orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}