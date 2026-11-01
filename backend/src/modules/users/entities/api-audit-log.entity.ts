import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './users.entity';

@Entity('api_audit_logs')
export class ApiAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column('varchar')
  @Index()
  api_type: string;

  @Column('text', { nullable: true })
  response_text: string;

  @Column('varchar', { nullable: true })
  error_message: string;

  @Column('int', { nullable: true })
  status_code: number;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  @ManyToOne(() => User, user => user.audit_logs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

