import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryProvider } from 'src/config/cloudinary.config';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        CloudinaryProvider(this.configService);
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: process.env.CLOUDINARY_IMAGE_FOLDER,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed with no result.'));
                    resolve(result);
                }
                ,
            ).end(file.buffer);
        });
    }

    async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    async deleteImages(publicIds: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.api.delete_resources(publicIds, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
