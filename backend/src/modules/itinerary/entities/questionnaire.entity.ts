import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,ManyToOne,JoinColumn} from 'typeorm';
import { User } from '../../users/entities/users.entity';

export enum FieldTypeQuestions {
  TEXT = 'text',
  DROPDOWN = 'dropdown',
  MULTI_SELECT = 'multi-select',
  DATE = 'date'
}

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question_text: string;

  @Column({ type: 'enum', enum: FieldTypeQuestions })
  field_type: FieldTypeQuestions;

  @Column('jsonb', { nullable: true })
  options: string[];

  @Column('text', { nullable: true })
  example: string;

  @Column('text', { nullable: true })
  image_url: string;

  @Column({ default: false })
  is_default: boolean;

  @Column({ nullable: true })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.questionnaires, { nullable: true,onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}