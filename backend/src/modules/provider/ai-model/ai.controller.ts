import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @ApiOperation({
        summary: 'Generate AI Response (testing only)',
        description: `Generates a travel itinerary based on the user's destination, duration, and preferences. AI is used to generate smart recommendations.`,
      })
  @ApiResponse({ status: 200, description: 'AI response returned successfully' })
  @ApiResponse({ status: 500, description: 'AI service failed' })
  async generateResponse(@Body() dto: AiRequestDto) {
    const result = await this.aiService.processAiRequest(dto);

    if (result.statusCode !== 200) {
      throw new HttpException(result.response, result.statusCode);
    }

    return result.response;
  }
}
