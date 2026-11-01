import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CloudinaryModule } from '../provider/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageRepository } from './repository/image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Image]),CloudinaryModule],
  controllers: [ImageController],
  providers: [ImageService,ImageRepository],
  exports: [ImageService,ImageRepository],
})
export class ImageModule {}
