import { ApiProperty, ApiPropertyOptional,} from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  IsEnum
} from 'class-validator';
import { Length } from 'class-validator';
import { FieldTypeQuestions } from 'src/modules/itinerary/entities/questionnaire.entity';

export class CreateQuestionnaireDto {
  @ApiProperty({ example: 'Preferred trip duration?' })
  @IsString()
  @IsNotEmpty()
  @Length(5,500)
  question_text: string;

  @ApiProperty({
    example: 'dropdown',
    description: 'Possible values: text, dropdown, radio, checkbox, image_upload, etc.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(FieldTypeQuestions)
  @Length(5,15)
  field_type: string;

  @ApiPropertyOptional({
    example: ['1-3 days', '4-7 days', '8+ days'],
    description:
      'Options are required for dropdown, radio, or checkbox type fields.',
  })
  @ValidateIf((o) =>
    ['dropdown', 'radio', 'checkbox'].includes(o.field_type),
  )
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional({
    example: 'https://cdn.swiftotp.com/question-icons/trip-duration.png',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
