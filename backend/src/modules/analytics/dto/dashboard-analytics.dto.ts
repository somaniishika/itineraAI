import { IsIn, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional,ApiProperty } from '@nestjs/swagger';
import { IsValidDate } from '../decorators/is-validate-date';

export class GetDashboardAnalyticsDto {
  @IsOptional()
  @IsIn(['users', 'feedbacks', 'revenue'])
  @ApiProperty({ enum: ['users', 'feedbacks', 'revenue'] })
  type?: 'users' | 'feedbacks' | 'revenue';

  @IsOptional()
  @IsIn(['monthly', 'yearly'])
  @ApiPropertyOptional({ enum: ['monthly', 'yearly'] })
  periodType?: 'monthly' | 'yearly';

  @IsOptional()
  @IsDateString()
  @IsValidDate({ message: 'Invalid date: Feb 29 is allowed only in leap years like 2024, 2008,etc..' })
  @ApiPropertyOptional()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @IsValidDate({ message: 'Invalid date: Feb 29 is allowed only in leap years like 2024, 2008,etc..' })
  @ApiPropertyOptional()
  endDate?: string;
}
