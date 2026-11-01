import { IsIn, IsOptional,IsDateString} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidDate } from '../decorators/is-validate-date';

export class GetPaymentAnalyticsDto {
  @IsOptional()
  @IsIn(['monthly', 'yearly'])
  @ApiPropertyOptional({ enum: ['monthly', 'yearly'], description: 'Type of analytics to fetch' })
  type?: 'monthly' | 'yearly';

  @IsOptional()
  @IsDateString()
  @IsValidDate({ message: 'Invalid date: Feb 29 is allowed only in leap years like 2024, 2008,etc..' })
  @ApiPropertyOptional({ description: 'Start date for filtering (YYYY-MM-DD)' })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @IsValidDate({ message: 'Invalid date: Feb 29 is allowed only in leap years like 2024, 2008,etc..' })
  @ApiPropertyOptional({ description: 'End date for filtering (YYYY-MM-DD)' })
  endDate?: string;
}
