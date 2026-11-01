import {Injectable} from '@nestjs/common';
import { TripLengthGuideRepository } from './repositories/trip-length-guide.repository';
import { TripLengthDirectiveService } from './services/trip-length-directive.service';
import { AiService } from '../provider/ai-model/ai.service';
import { AiRequestDto } from '../provider/ai-model/dto/ai-request.dto';
import { SendGridService } from '../provider/sendgrid/sendgrid.service';
import { UserRepository } from '../users/repositories/users.repository';
import { CreateTripLengthGuideDto } from './dtos/create-trip-length-guide.dto';
import { tripLengthGuideTemplate } from '../provider/sendgrid/templates/trip-length-guide.template';
import { FeatureManagementService } from '../feature-management/feature-management.service';
import { TripLengthGuideMessages } from './constants/trip-length-guide.constants';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
@Injectable()
export class TripLengthGuideService {
  constructor(
    private readonly tripLengthGuideRepo: TripLengthGuideRepository,
    private readonly promptService: TripLengthDirectiveService,
    private readonly geminiService: AiService,
    private readonly sendGridService: SendGridService,
    private readonly userRepository: UserRepository,
    private readonly featureManagementService: FeatureManagementService,
  ) {}

  async generateTripLengthGuide(userId: number, dto: CreateTripLengthGuideDto) {
    // Check if user has available credits
    const creditsInfo =
      await this.featureManagementService.getFeatureCredits(userId);
    const currentGuideCredits =
      creditsInfo.feature_balances['TRIP_GUIDE'] || 0;
    console.log(
      `User ${userId} has ${currentGuideCredits} trip guide credits available.`,  )
      if (currentGuideCredits <= 0) {
        throw new Error(TripLengthGuideMessages.NO_CREDITS);
      }
  

    const prompt = this.promptService.generateTripLengthPrompt(dto.location);

    const aiDto: AiRequestDto = {
      user_id: userId,
      api_type: 'TRIP_GUIDE',
      prompt: prompt,
    };


    const aiResponse = await this.geminiService.processAiRequest(aiDto);
   const candidate = aiResponse?.data?.candidates?.[0];
   const part = candidate?.content?.parts?.[0];
   if (!part?.text) {
    throw new Error(TripLengthGuideMessages.INVALID_AI_RESPONSE);
   }
   const rawText = part.text;
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '').trim();
    let guideData: any;

    try {
      guideData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(TripLengthGuideMessages.PARSE_ERROR);
    }

    const savedGuide = await this.tripLengthGuideRepo.create({
      user_id: userId,
      location: dto.location.trim(),
      content: guideData,
    });

  
    await this.featureManagementService.decrementUserFeatureCredit(
      userId,
      'TRIP_GUIDE',
    );

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(TripLengthGuideMessages.USER_NOT_FOUND);
    }

    const { full_name, email } = user;
    const { subject, text, html } = tripLengthGuideTemplate(
      full_name,
      savedGuide.id.toString(),
      dto.location,
    );

    await this.sendGridService.sendEmail({
      to: email,
      subject,
      text,
      html,
    });

    return {
      guide_id: savedGuide.id,
      data: guideData,
    };
  }


  async getTripLengthGuideById(id: number,userId: number,) {
    const guide = await this.tripLengthGuideRepo.findById(id);
    if (!guide) {
      throw new Error(TripLengthGuideMessages.GUIDE_NOT_FOUND);
    }

    if (guide.user_id !== userId) {
      throw new Error(TripLengthGuideMessages.UNAUTHORIZED_ACCESS);
    }
    
    return guide;
  }
  
  async getUserTripLengthGuides(userId: number, query: PaginationQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    console.log('Limit:', limit, 'Page:', page); 
    const { items, total } = await this.tripLengthGuideRepo.findUserTripGuides(
      userId,
      page,
      limit,
    );
  
    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
