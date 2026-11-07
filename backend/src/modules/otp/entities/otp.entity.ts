import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index() 
  user_id!: number;

  @Column('varchar')
  otp_code!: string;

  @Column({
    type: 'enum',
    enum: ['VERIFY_EMAIL', 'PASSWORD_RESET', 'EMAIL_CHANGE']
  })
  purpose!: string;

  @Column({ default: 5 })
  otp_limit!: number;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, user => user.otps)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}