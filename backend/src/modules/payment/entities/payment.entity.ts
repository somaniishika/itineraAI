import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { FeatureOrder } from './feature-order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  user_id: number;

  @Column()
  @Index()
  order_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ unique: true , nullable: true })
  transaction_id: string ;

  @Column({ type: 'enum', enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' })
  status: string;

  @Column({ type: 'jsonb' })
  payment_gateway_response: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => FeatureOrder)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'order_id' })
  order: FeatureOrder;
}