import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, Index } from 'typeorm';
import { UserFeatureBalance } from '../../feature-management/entities/users-feature-balance.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Itinerary } from '../../itinerary/entities/itinerary.entity';
import { TripLengthGuide } from '../../trip-guide/entities/trip-length-guide.entity';
import { EmergencyContact } from '../../emergency/entities/emergency-contact.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Otp } from '../../otp/entities/otp.entity';
import { SuspensionRequest } from './suspension-request.entity';
import { Questionnaire } from '../../itinerary/entities/questionnaire.entity';
import { ApiAuditLog } from './api-audit-log.entity';
import { FeatureOrder } from '../../payment/entities/feature-order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true, nullable: true }) 
  @Index()
  username: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true }) 
  address: string;

  @Column({ nullable: true }) 
  password_hash: string;

  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  @Index()
  role: string;

  @Column({ default: false })
  @Index()
  is_suspended: boolean;

  @Column({ default: false })
  @Index()
  email_verified: boolean;

  @Column({ default: false })
  @Index()
  is_deleted: boolean;

  @Column({ nullable: true })
  @Index()
  deleted_at: Date;


  @Column({ nullable: true })
  profile_picture: string;

  @Column({ type: 'enum', enum: ['local', 'google'], default: 'local' })
  @Index()
  provider: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserFeatureBalance, balance => balance.user)
  feature_balances: UserFeatureBalance[];

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];

  @OneToMany(() => Itinerary, itinerary => itinerary.user)
  itineraries: Itinerary[];

  @OneToMany(() => TripLengthGuide, guide => guide.user)
  trip_guides: TripLengthGuide[];

  @OneToMany(() => EmergencyContact, contact => contact.user)
  emergency_contacts: EmergencyContact[];

  @OneToMany(() => Feedback, feedback => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Otp, otp => otp.user)
  otps: Otp[];

  @OneToOne(() => SuspensionRequest, request => request.user)
  suspension_request: SuspensionRequest;

  @OneToMany(() => Questionnaire, questionnaire => questionnaire.created_by)
  questionnaires: Questionnaire[];

  @OneToMany(() => ApiAuditLog, log => log.user)
  audit_logs: ApiAuditLog[];

  @OneToMany(() => FeatureOrder, order => order.user)
  feature_orders: FeatureOrder[];
}