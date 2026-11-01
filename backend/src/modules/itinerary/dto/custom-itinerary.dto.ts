import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested, IsArray, IsEnum } from "class-validator";

export class DayWiseCustomizationDto {
  @ApiProperty({
    example: 1,
    description: 'Day number for customization'
  })
  @IsNumber()
  day: number;

  @ApiProperty({
    example: 'I want to visit more temples on this day',
    description: 'Customization request for this specific day'
  })
  @IsString()
  customization_text: string;

  @ApiProperty({
    example: 'activity',
    enum: ['activity', 'restaurant', 'accommodation', 'transport'],
    description: 'Type of customization',
    required: false
  })
  @IsOptional()
  @IsEnum(['activity', 'restaurant', 'accommodation', 'transport'])
  customization_type?: 'activity' | 'restaurant' | 'accommodation' | 'transport';
}

export class GeneralCustomizationDto {
  @ApiProperty({
    example: 'dietary',
    enum: ['dietary', 'accessibility', 'budget', 'timing', 'transport', 'accommodation'],
    description: 'Type of general customization'
  })
  @IsEnum(['dietary', 'accessibility', 'budget', 'timing', 'transport', 'accommodation'])
  type: 'dietary' | 'accessibility' | 'budget' | 'timing' | 'transport' | 'accommodation';

  @ApiProperty({
    example: 'vegetarian only',
    description: 'Customization value or description'
  })
  @IsString()
  value: string;

  @ApiProperty({
    example: 'Please ensure all meals are vegetarian',
    description: 'Additional notes for this customization',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CustomItineraryInputDto {
  @ApiProperty({ 
    required: false, 
    example: 'Lonavala',
    description: 'Travel destination'      
  })
  @IsOptional()
  @IsString()
  travel_location?: string;

  @ApiProperty({ 
    required: false, 
    example: 'India',
    description: 'Country of destination'  
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ 
    required: false, 
    example: 3, 
    minimum: 1, 
    maximum:10,
    description: 'Trip duration in days'   
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  trip_duration?: number;

  @ApiProperty({
    example: ['adventure', 'culture', 'food'],
    description: 'Travel interests and preferences',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];

  @ApiProperty({
    example: 'couple',
    enum: ['solo', 'couple', 'family', 'friends', 'group'],
    description: 'Type of travel group',
    required: false
  })
  @IsOptional()
  @IsEnum(['solo', 'couple', 'family', 'friends', 'group'])
  travel_type?: 'solo' | 'couple' | 'family' | 'friends' | 'group';

  @ApiProperty({
    example: 'Standard',
    enum: ['Budget', 'Standard', 'Luxury'],
    description: 'Budget category preference',
    required: false
  })
  
  @ApiProperty({
    type: [DayWiseCustomizationDto],
    required: false,
    description: 'Day-wise customization requests',
    example: [
      {
        day: 1,
        customization_text: 'I want to visit more temples on this day',
        customization_type: 'activity'
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayWiseCustomizationDto)
  day_wise_customizations?: DayWiseCustomizationDto[];

  @ApiProperty({
    type: [GeneralCustomizationDto],
    required: false,
    description: 'General customization preferences',
    example: [
      {
        type: 'dietary',
        value: 'vegetarian only',
        notes: 'Please ensure all meals are vegetarian'
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GeneralCustomizationDto)
  general_customizations?: GeneralCustomizationDto[];
}

export interface CustomItineraryRequestDto {
  itinerary_id: string;
  user_id: string;
  travel_location?: string;
  country?: string;
  trip_duration?: number;
  preferences?: string[];
  travel_type?: 'solo' | 'couple' | 'family' | 'friends' | 'group';
  budget_category?: 'Budget' | 'Standard' | 'Luxury';
  //source_questions_answers?: SourceQuestionsAnswersDto;
  day_wise_customizations?: DayWiseCustomizationDto[];
  general_customizations?: GeneralCustomizationDto[];
}