import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { AiResponse } from '../interfaces/ai-response.interface';

@Injectable()
export class GeminiProvider {
  private readonly API_KEY = process.env.GEMINI_API_KEY;
  private readonly BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`;
  private readonly logger = new Logger(GeminiProvider.name);

  async generateResponse(prompt: string): Promise<AiResponse> {
    try {
      const result = await axios.post(this.BASE_URL, {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        timeout: 600000, // 10 minutes in milliseconds to allow for longer processing times
      });

      return {
        statusCode: 200,
        response: result,
      };
    } catch (error) {
      this.logger.error(`Gemini API call failed: ${error.message}`);
      return {
        statusCode: error.response?.status || 500,
        response: error.response?.data || error.message,
      };
    }
  }
}
