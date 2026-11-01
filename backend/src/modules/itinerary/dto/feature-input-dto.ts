import { ApiProperty, ApiExtraModels, getSchemaPath, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsObject,IsString,IsNumber,Min,Max,ArrayMinSize,ArrayMaxSize,IsArray,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export enum ItineraryFeatureType {
  BUDGET = 'BUDGET_PLAN',
  CUSTOM = 'CUSTOM_ITINERARY',
  PACKING_LIST = 'PACKING_LIST',
}

class TravelerInfo {
  @ApiProperty({ example: 'Female', enum: ['Male', 'Female', 'Other'] })
  @IsEnum(['Male', 'Female', 'Other'], {
    message: 'Gender must be one of: Male, Female, Other',
  })
  gender: string;

  @ApiProperty({ example: 22 })
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(0, { message: 'Age must be at least 0' })
  @Max(100, { message: 'Age must be at most 100' })
  age: number;
}

// Budget feature input structure
export class BudgetInputDto {
  @ApiProperty({ example: 3 })
  number_of_people: number;

  @ApiProperty({ example: 'Standard' })
  budget_type: string;

  @ApiProperty({ example: 'Indore' })
  starting_location: string;

  @ApiProperty({ example: 50000 })
  total_budget: number;

  @ApiProperty({ example: 'INR' })
  currency: string;
}

export class CustomInputDto {
  @ApiProperty({ example: 'Lonavala' })
  travel_location: string;

  @ApiProperty({ example: 'India' })
  country: string;

  @ApiProperty({ example: 3 })
  trip_duration: number;

  @ApiProperty({ example: ['adventure', 'nature'], type: [String] })
  preferences: string[];
}

export class PackingListInputDto {
  @ApiProperty({ example: 'March', description: 'Month of travel' })
  @IsString()
  travel_month: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1, { message: 'Number of people must be at least 1' })
  @Max(8, { message: 'Number of people cannot exceed 8' })
  number_of_people: number;

  @ApiProperty({
    description: 'List of travelers with age and gender',
    type: [TravelerInfo],
  })
  @IsArray({ message: 'Travelers must be an array' })
  @ArrayMinSize(1, { message: 'At least one traveler is required' })
  @ArrayMaxSize(8, { message: 'No more than 8 travelers allowed' })
  @ValidateNested({ each: true })
  @Type(() => TravelerInfo)
  travelers: TravelerInfo[];

  @ApiPropertyOptional({ example: 'Backpack', description: 'Luggage type' })
  @IsString()
  luggage_type: string;

  @ApiPropertyOptional({ example: ['camera', 'power bank'], required: false })
  @IsOptional()
  @IsArray()
  special_items?: string[];
}


@ApiExtraModels(BudgetInputDto, CustomInputDto,PackingListInputDto)
export class FeatureInputDto {
  @ApiProperty({
    description: 'Type of feature to perform',
    enum:   ItineraryFeatureType,
    enumName: 'FeatureType',
    example: ItineraryFeatureType.BUDGET,
  })
  @IsEnum(ItineraryFeatureType)
  type: ItineraryFeatureType;

  @ApiProperty({
    description: 'Optional input parameters for the selected feature type',
    required: false,
    oneOf: [
      { $ref: getSchemaPath(BudgetInputDto) },
      { $ref: getSchemaPath(CustomInputDto) },
      {$ref: getSchemaPath(PackingListInputDto) }
    ]
  })
  @IsOptional()
  @IsObject()
  inputs?: any;
}
