import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { FieldTypeQuestions } from 'src/modules/itinerary/entities/questionnaire.entity';

export class UpdateQuestionnaireDto {
  @ApiPropertyOptional({ example: 'Updated trip duration question?' })
  @IsOptional()
  @IsString()
  @Length(5,500)
  question_text?: string;

  @ApiPropertyOptional({
    example: FieldTypeQuestions.DROPDOWN,
    enum: FieldTypeQuestions,
    description: 'Possible values: TEXT, DROPDOWN, MULTI_SELECT, DATE',
  })
  @IsOptional()
  @IsEnum(FieldTypeQuestions)
  @Length(5,15)
  field_type?: FieldTypeQuestions;

  @ApiPropertyOptional({
    example: ['1-2 days', '3-5 days', '6+ days'],
    description:
      'Options required if field_type is dropdown or multi-select.',
  })
  @ValidateIf((o) =>
    [FieldTypeQuestions.DROPDOWN, FieldTypeQuestions.MULTI_SELECT].includes(o.field_type),
  )
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional({
    example: 'https://cdn.swiftotp.com/question-icons/new-trip-duration.png',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
