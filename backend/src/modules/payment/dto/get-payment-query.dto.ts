import {ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {IsOptional,IsString,IsEnum,Min,Max,IsInt,} from 'class-validator';

export class GetPaymentsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['PENDING', 'SUCCESS', 'FAILED'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Search by user name or email',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}
