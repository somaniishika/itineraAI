import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, Index } from 'typeorm';

@Entity('images')
@Unique(['publicId'])
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicId: string;

  @Column()
  @Index()
  url: string;

  @Column()
  purpose: string; 
  
  @Column({ default: false })
  @Index()
  isUsed: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
