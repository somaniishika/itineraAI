import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './users.entity';

@Entity('suspension_requests')
export class SuspensionRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() // frequently filtered or joined on
  user_id: number;

  @Column('text', { nullable: true })
  user_request_message: string | null;

  @Column('text', { nullable: false })
  suspension_reason: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  @Index()
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  created_at: Date;

  @OneToOne(() => User, user => user.suspension_request)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
