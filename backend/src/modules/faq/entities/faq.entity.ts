import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('faqs')
export class Faq {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  question!: string;

  @Column('text')
  answer!: string;
  
  @Column('varchar', { length: 100 })
  category!: string;

  @CreateDateColumn()
  created_at!: Date;
}