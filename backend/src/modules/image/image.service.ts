import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../provider/cloudinary/cloudinary.service';
import { ImageRepository } from './repository/image.repository';
import { In } from 'typeorm';
import { ImageServiceMessages } from './constant/image.messages';

@Injectable()
export class ImageService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageRepository: ImageRepository,
  ) {}

  
  async uploadImage(file: Express.Multer.File, purpose: string) {
  try {
    if (!file) throw new Error(ImageServiceMessages.FILE_NOT_PROVIDED);

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    const imageRecord = await this.imageRepository.createAndSave({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      purpose 
    });

    return {
      url: imageRecord.url,
      publicId: imageRecord.publicId
    };
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error(ImageServiceMessages.IMAGE_UPLOAD_FAILED);
  }
  }

  async markImagesAsUsedByUrls(urls: string[]): Promise<void> {
    await this.imageRepository.markImagesAsUsedByUrls(urls);
  }

  async deleteImage(publicId: string) {
    await this.cloudinaryService.deleteImage(publicId);
    await this.imageRepository.deleteByPublicId(publicId);
  }

  async deleteImages(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) return;

    await this.cloudinaryService.deleteImages(publicIds);
    console.log('Bulk deletion of images on Clodinary done');
    await this.imageRepository.deleteByPublicIds(publicIds);
  }
}
