import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UnsplashService {
  private readonly logger = new Logger(UnsplashService.name);
  private readonly UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;
  private readonly baseUrl = 'https://api.unsplash.com';

  async getRandomImageByTag(tag: string, location: string): Promise<string | null> {
    const query = `${location} ${tag}`;
    
    try {
      const response = await axios.get(`${this.baseUrl}/photos/random`, {
        params: {
          query,
        },
        headers: {
          Authorization: `Client-ID ${this.UNSPLASH_ACCESS_KEY}`,
        },
      });

      const imageUrl = response.data?.urls?.regular;
      if (imageUrl) {
        this.logger.log(`Image fetched for "${query}": ${imageUrl}`);
        return imageUrl;
      }

      this.logger.warn(`No image found for "${query}"`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch image for "${query}"`, error.message);
      return null;
    }
  }
}
