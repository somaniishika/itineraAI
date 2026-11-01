import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiAuditLog } from 'src/modules/users/entities/api-audit-log.entity';
import { Repository } from 'typeorm';
import { AiRequestDto } from './dto/ai-request.dto';
import { GeminiProvider } from './providers/gemini.provider';

@Injectable()
export class AiService {
  constructor(
    private readonly geminiProvider: GeminiProvider,
    @InjectRepository(ApiAuditLog)
    private readonly auditLogRepo: Repository<ApiAuditLog>,
    private readonly logger: Logger = new Logger(AiService.name)
  ) {}

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getBackoffDelay(attempt: number): number {
    const baseDelay = 500; // 0.5 seconds base
    const maxDelay = 10000; // max 10 seconds
    const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
    const jitter = Math.random() * delay;  
    return jitter;
  }

  async processAiRequest(dto: AiRequestDto) {
    const maxRetries = 8;
    let attempt = 0;

    this.logger.log(`Processing AI request for user ${dto.user_id} with API type ${dto.api_type}`);

    while (attempt <= maxRetries) {
      try {
        const result = await this.geminiProvider.generateResponse(dto.prompt);

        if (result.statusCode === 200) {
          this.logger.log(`AI response for user ${dto.user_id} with API type ${dto.api_type} generated successfully.`);
          return result.response;
        }

        // If not successful log and retry
        this.logger.warn(`Attempt ${attempt + 1}: Gemini API returned status ${result.statusCode}`);

        if (result.statusCode === 503 && attempt < maxRetries) {
          const delay = this.getBackoffDelay(attempt);
          this.logger.log(`Retrying after ${Math.round(delay)} ms...`);
          await this.delay(delay);
          attempt++;
        } else {
          // Final log entry if not retriable or retries exhausted
          await this.auditLogRepo.save({
            user_id: dto.user_id,
            api_type: dto.api_type,
            response_text: JSON.stringify(result),
            status_code: result.statusCode,
            error_message: typeof result.response === 'string' ? result.response : JSON.stringify(result.response),
          });
          this.logger.error(`AI service failed for user ${dto.user_id} with status ${result.statusCode}`);
          throw new Error(`AI service failed after ${attempt + 1} attempts: ${JSON.stringify(result.response)}`);
        }

      } catch (err) {
        // Catch network or unexpected internal errors
        this.logger.warn(`Attempt ${attempt + 1} failed with exception: ${err.message}`);
        if (attempt >= maxRetries) {
          await this.auditLogRepo.save({
            user_id: dto.user_id,
            api_type: dto.api_type,
            response_text: '',
            status_code: 500,
            error_message: err.message,
          });
          this.logger.error(`AI service failed after ${maxRetries + 1} attempts`);
          throw new Error(`AI service failed permanently: ${err.message}`);
        }
        const delay = this.getBackoffDelay(attempt);
        this.logger.log(`Retrying after ${Math.round(delay)} ms...`);
        await this.delay(delay);
        attempt++;
      }
    }
}
}
