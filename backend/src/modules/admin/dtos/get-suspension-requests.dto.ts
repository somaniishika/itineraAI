import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSuspensionRequestsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1, description: 'Page number (default: 1)' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 10, description: 'Items per page (default: 10)' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED'], {
    message: 'Status must be PENDING or APPROVED ',
  })
  @ApiPropertyOptional({
    enum: ['PENDING', 'APPROVED'],
    example: 'PENDING',
    description: 'Filter by suspension request status',
  })
  status?: 'PENDING' | 'APPROVED';
}
