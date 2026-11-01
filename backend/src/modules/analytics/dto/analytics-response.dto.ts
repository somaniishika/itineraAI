import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @IsString()
  feature: string;

  @IsInt()
  @Min(0)
  usageCount: number;
}