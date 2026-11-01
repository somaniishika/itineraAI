import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('emergency_contacts')
export class EmergencyContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() // fast lookup
  user_id: number;

  @Column('varchar')
  @Index() // helps with caching and repeated location lookups
  location: string;

  @Column('jsonb')
  contact_details: Record<string, string>;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.emergency_contacts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}