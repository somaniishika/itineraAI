import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { GeminiProvider } from './providers/gemini.provider';
import { ApiAuditLog } from 'src/modules/users/entities/api-audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiAuditLog])],
  providers: [AiService, GeminiProvider,Logger],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
