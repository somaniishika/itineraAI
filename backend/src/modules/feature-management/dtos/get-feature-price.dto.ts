import { IsEnum, IsOptional } from 'class-validator';
import { FeaturePriceMessages } from '../constants/feature-management.messages';
import { FeatureType } from 'src/common/utils/feature-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetFeaturePriceDto {
  @ApiPropertyOptional({ enum: FeatureType })
  @IsOptional()
  @IsEnum(FeatureType, { message: FeaturePriceMessages.MESSAGE })
  type?: FeatureType;
}