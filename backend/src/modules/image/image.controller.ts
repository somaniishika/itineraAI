import { Controller, Post, UploadedFile, UseInterceptors,Body, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { UploadImageResponseDto } from './dto/upload-image-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UploadImageSwagger } from './decorator/swagger/image-upload.swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageServiceMessages } from './constant/image.messages';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UploadImageSwagger()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('purpose') purpose: string,
  ): Promise<UploadImageResponseDto> {
    if (!purpose) {
      throw new BadRequestException(ImageServiceMessages.PURPOSE_REQUIRED);
    }
    try {
    return await this.imageService.uploadImage(file, purpose);
  } catch (error) {
    switch (error.message) {
      case ImageServiceMessages.FILE_NOT_PROVIDED:
        throw new BadRequestException(error.message);
      case ImageServiceMessages.IMAGE_UPLOAD_FAILED:
        throw new InternalServerErrorException(error.message);
      default:
        throw error;
    }
  }
  }
}
