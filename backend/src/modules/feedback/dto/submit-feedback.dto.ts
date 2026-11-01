import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray,IsUrl,Min,Max, ArrayMaxSize, ValidateNested } from 'class-validator';

class FeedbackImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl({}, { message: 'Each image URL must be valid' })
  url: string;

  @ApiProperty({ example: 'A beautiful view', description: 'Alt text for the image', required: false })
  @IsOptional()
  @IsString()
  alt?: string;
}

export class CreateFeedbackDto {
  @ApiProperty({ example: 'Amazing travel experience!' })
  @IsString()
  message: string;

  @ApiProperty({ example: 5, description: 'Rating out of 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: [
      {
        url: 'https://example.com/img1.jpg',
        alt: 'Image 1',
      },
      {
        url: 'https://example.com/img2.jpg',
        alt: 'Image 2',
      },

    ],
    type: [FeedbackImageDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: 'You can upload a maximum of 3 images.' })
  @ValidateNested({ each: true })
  @Type(() => FeedbackImageDto)
  images?: FeedbackImageDto[];
}