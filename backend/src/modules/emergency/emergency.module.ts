import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { EmergencyContactRepository } from './repositories/emergency-contact.repository';
import { EmergencyPromptService } from './service/emergency-prompt.service';
import { AiModule } from '../provider/ai-model/ai.module';
import { SendGridModule } from '../provider/sendgrid/sendgrid.module';
import { UsersModule } from '../users/users.module';
import { FeatureManagementModule } from '../feature-management/feature-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmergencyContact]),
    AiModule,
    SendGridModule,
    UsersModule,
    FeatureManagementModule,
  ],
  controllers: [EmergencyController],
  providers: [
    EmergencyService,
    EmergencyContactRepository,
    EmergencyPromptService,
  ],
  exports: [EmergencyService],
})
export class EmergencyModule {}