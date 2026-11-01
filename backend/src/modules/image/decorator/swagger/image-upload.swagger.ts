import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation,ApiUnauthorizedResponse,
ApiInternalServerErrorResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { UploadImageResponseDto } from '../../dto/upload-image-response.dto';

export function UploadImageSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload an image to Cloudinary',
      description: 'Uploads an image with a specific purpose (e.g., feedback, profile, document).',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      required: true,
      description: 'Image file and its usage purpose',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image file to upload',
          },
          purpose: {
            type: 'string',
            example: 'feedback',
            description: 'Purpose for uploading (e.g., feedback)',
          },
        },
        required: ['file', 'purpose'],
      },
    }),
    ApiCreatedResponse({
      description: 'Image uploaded successfully',
      type: UploadImageResponseDto,
      schema: {
        example: {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
          publicId: 'sample_public_id_123',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T04:04:42.254Z',
          path: '/image',
          error: 'Unauthorized',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[{
        example: {
          timestamp: '2025-06-05T04:05:13.879Z',
          path: '/image',
        }},
        {
        example: {
          timestamp: '2025-06-05T04:05:13.879Z',
          path: '/image',
          error: 'Failed to upload image',
        }}
      ]
      },
    }),
  );
}
