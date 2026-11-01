import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FeatureType } from 'src/common/utils/feature-type.enum';
import { Type } from 'class-transformer';

export class FeaturePriceDto {
  @ApiProperty({ enum: FeatureType})
  @IsEnum(FeatureType)
  featureType: FeatureType;

  @ApiProperty()
  @IsNumber()
  priceAmount: number;

  @ApiProperty({ required: false, example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class SetFeaturePricesDto {
  @ApiProperty({ type: [FeaturePriceDto] })
  @ValidateNested({ each: true })
  @Type(() => FeaturePriceDto)
  prices: FeaturePriceDto[];
}
