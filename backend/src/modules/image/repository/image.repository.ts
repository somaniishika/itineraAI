import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {
  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  async createAndSave(data: Partial<Image>): Promise<Image> {
    const image = this.create(data);
    return this.save(image);
  }

  async deleteByPublicId(publicId: string): Promise<void> {
    await this.delete({ publicId });
  }

  async markImageAsUsed(publicId: string): Promise<void> {
    await this.update({ publicId }, { isUsed: true });
  }

  async findUnusedOlderThan(minutes: number): Promise<Image[]> {
    const threshold = new Date(Date.now() - minutes * 60 * 1000);
    return this.createQueryBuilder('image')
      .where('image.isUsed = :isUsed', { isUsed: false })
      .andWhere('image.createdAt < :threshold', { threshold })
      .getMany();
  }

  async markImagesAsUsedByUrls(urls: string[]): Promise<void> {
  if (!urls || urls.length === 0) return;
  console.log('Marking images as used in mage repo', urls);
  await this.createQueryBuilder()
    .update()
    .set({ isUsed: true })
    .where('url IN (:...urls)', { urls })
    .execute();
}

async deleteByPublicIds(publicIds: string[]): Promise<void> {
    if (!publicIds || publicIds.length === 0) return;
    await this.delete({ publicId: In(publicIds) });
  }
}
