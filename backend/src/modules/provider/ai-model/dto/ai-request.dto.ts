import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FeatureType } from 'src/common/utils/feature-type.enum';

export class AiRequestDto {
  @ApiProperty({
    example: 42,
    description: 'ID of the user making the AI request',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'itinerary',
    description: 'Type of AI task to be executed',
    enum: FeatureType,
  })
  @IsIn(['ITINERARY', 'BUDGET_PLAN', 'CUSTOM_ITINERARY', 'PACKING_LIST', 'EMERGENCY_CONTACT', 'TRIP_GUIDE'])
  api_type: string;

  @ApiProperty({
    example: `Generate a 7-day itinerary for a nature-loving traveler visiting Bali, Indonesia. Include 3-4 activities per day, suitable for a vegetarian, with interests in beaches, wellness retreats, and hiking.`,
    description: 'Prompt text that is passed to the AI engine for response generation',
  })
  @IsString()
  prompt: string;
}
