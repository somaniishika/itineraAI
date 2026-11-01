import { IsOptional,IsNotEmpty, IsEnum} from 'class-validator';
import { AnalyticsType,AnalyticsTimeframe } from '../constants/admin.messages';

export class DashboardAnalyticsQueryDto {
  @IsNotEmpty()
  @IsEnum(AnalyticsType)
  type?: AnalyticsType;

  @IsOptional()
  @IsEnum(AnalyticsTimeframe)
  timeframe?: AnalyticsTimeframe;
}