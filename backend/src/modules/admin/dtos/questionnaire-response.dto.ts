import { ApiProperty } from '@nestjs/swagger';

export class QuestionnaireResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Preferred travel destination?' })
  question_text: string;

  @ApiProperty({ example: 'text' })
  field_type: string;

  @ApiProperty({ example: ['Adventure', 'Relaxation'], required: false })
  options?: string[];

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image_url?: string;

  @ApiProperty({ example: false })
  is_default: boolean;

  @ApiProperty({ example: 1, nullable: true })
  created_by: number | null;

  @ApiProperty({ example: '2025-05-01T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-05-01T12:00:00Z' })
  updated_at: Date;
}
