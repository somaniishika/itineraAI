import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { ImageService } from '../../image/image.service';
import { ImageRepository } from '../../image/repository/image.repository';

@Injectable()
export class ImageCleanupCronService {
  private readonly logger = new Logger(ImageCleanupCronService.name);

  constructor(private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
    private readonly imageRepository: ImageRepository
  ) {}
  
// @Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_3_HOURS)
  async pruneUnusedImages() {
    const unusedImages = await this.imageRepository.findUnusedOlderThan(60); // minutes

    const publicIds = unusedImages.map(image => image.publicId);
    await this.imageService.deleteImages(publicIds);

    this.logger.log(`Pruned ${unusedImages.length} unused images older than 60 minutes.`);
  }
}
