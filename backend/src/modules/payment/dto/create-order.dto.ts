import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum FeatureCategory {
  ITINERARY = 'ITINERARY',
  BUDGET_PLAN = 'BUDGET_PLAN',
  PACKING_LIST = 'PACKING_LIST',
  CUSTOM_ITINERARY = 'CUSTOM_ITINERARY',
  TRIP_GUIDE = 'TRIP_GUIDE',
}

export class FeatureCreditDto {
  @ApiProperty({
    description: 'Feature category for which credits are being purchased',
    enum: FeatureCategory,
    example: FeatureCategory.ITINERARY,
  })
  @IsEnum(FeatureCategory)
  feature: FeatureCategory;

  @ApiProperty({
    description: 'Number of credits user wants to purchase for this feature',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  credits: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of feature categories with their respective credit quantities',
    type: [FeatureCreditDto],
    example: [
      { feature: 'ITINERARY', credits: 2 },
      { feature: 'PACKING_LIST', credits: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureCreditDto)
  featureCredits: FeatureCreditDto[];
}
