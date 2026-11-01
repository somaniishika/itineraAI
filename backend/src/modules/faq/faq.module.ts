import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqRepository } from './repositories/faq.repository';
import { FaqSeeder } from 'src/database/seeders/faq.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  providers: [FaqService,FaqRepository, FaqSeeder],
  controllers: [FaqController],
})
export class FaqModule {}