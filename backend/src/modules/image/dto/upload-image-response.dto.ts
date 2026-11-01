import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    description: 'Secure URL of the uploaded image',
    example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Cloudinary public identifier of the uploaded image',
    example: 'sample_public_id_123',
  })
  publicId: string;
}
