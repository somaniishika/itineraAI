import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ItineraryRepository } from './repositories/itinerary.repository';
import { QuestionnaireRepository } from './repositories/questionnaire.repository';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItineraryDirectiveService } from './service/itinerary-directive.service';
import { AiService } from '../provider/ai-model/ai.service';
import { AiRequestDto } from '../provider/ai-model/dto/ai-request.dto';
import { SendGridService } from '../provider/sendgrid/sendgrid.service';
import { UserRepository } from '../users/repositories/users.repository';
import { itineraryNotificationTemplate } from '../provider/sendgrid/templates/itinerary-ready.template';
import { FeatureManagementService } from '../feature-management/feature-management.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ItineraryFeatureRepository } from './repositories/itinerary-feature.repository';
import { BudgetDirectiveService } from './service/budget-directive.service';
import { CustomDirectiveService } from './service/custom-directive.service';
import { PackingListDirectiveService } from './service/packing-directive';
import { FeatureInputDto } from './dto/feature-input-dto';
import { CustomItineraryInputDto } from './dto/custom-itinerary.dto';
import { PackingListInputDto } from './dto/feature-input-dto';
import { CustomItineraryRequest } from './service/custom-directive.service';
import { customItineraryNotificationTemplate } from '../provider/sendgrid/templates/custom-itinerary.template';
import { packingListNotificationTemplate } from '../provider/sendgrid/templates/packing-list.template';
import { ItineraryServiceMessages } from './constant/itinerary.constants';
import { ItineraryFeatureMessages } from './constant/itinerary-feature.messages';
import { budgetPlanningNotificationTemplate } from '../provider/sendgrid/templates/budget-plan.template';
import { FeatureType } from 'src/common/utils/feature-type.enum';
import { UnsplashService } from '../provider/unsplash/unsplash.service';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);
  constructor(
    private readonly itineraryRepo: ItineraryRepository,
    private readonly questionnaireRepo: QuestionnaireRepository,
    private readonly promptService: ItineraryDirectiveService,
    private readonly geminiService: AiService,
    private readonly sendGridService: SendGridService,
    private readonly userRepository: UserRepository,
    private readonly featureManagementService: FeatureManagementService,
    private readonly itineraryFeatureRepo: ItineraryFeatureRepository,
    private readonly budgetDirectiveService: BudgetDirectiveService,
    private readonly customDirectiveService: CustomDirectiveService,
    private readonly packingListDirectiveService: PackingListDirectiveService,
    private readonly unsplashService: UnsplashService,
  ) { }

  async getQuestionsWithAnswers(userId: number) {
    try {
      const latestItinerary = await this.itineraryRepo.findLatestByUser(userId);
      const savedAnswers = latestItinerary
        ? latestItinerary.source_questions_answers
        : {};

      const questions = await this.questionnaireRepo.findAll();

      const mapped = questions.map((question) => ({
        id: question.id,
        question_text: question.question_text,
        field_type: question.field_type,
        options: question.options,
        image_url: question.image_url,
        answer: savedAnswers[question.question_text] ?? null,
      }));

      return mapped;
    } catch (error) {
      throw new Error(ItineraryServiceMessages.QUESTIONS_FETCH_FAILED);
    }
  }

  async createItinerary(userId: number, dto: CreateItineraryDto) {
    // Check if user has available itinerary credits
    const creditsInfo =
      await this.featureManagementService.getFeatureCredits(userId);
    const currentItineraryCredits =
      creditsInfo.feature_balances[FeatureType.ITINERARY] || 0;
    console.log('Current itinerary credits:', currentItineraryCredits);

    if (currentItineraryCredits <= 0) {
      throw new Error(ItineraryServiceMessages.INSUFFICIENT_CREDITS);
    }

    const prompt = this.promptService.generateItineraryPrompt(
      dto.travel_location,
      dto.country,
      dto.trip_duration,
      dto.source_questions_answers,
    );

    const aiDto: AiRequestDto = {
      user_id: userId,
      api_type: FeatureType.ITINERARY,
      prompt: prompt,
    };

    let itineraryData;
    try {
      const aiResponse = await this.geminiService.processAiRequest(aiDto);
      const rawText = aiResponse.data.candidates[0].content.parts[0].text;
      const cleanedText = rawText.replace(/```json\s*|\s*```/g, '');
      itineraryData = JSON.parse(cleanedText);
    } catch (error) {
      throw new Error(ItineraryServiceMessages.AI_RESPONSE_INVALID);
    }

    try {
      const tags = itineraryData.tags || [];
      const query = tags.length
        ? `${dto.travel_location} ${tags.join(' ')}`
        : dto.travel_location;

      const image = await this.unsplashService.getRandomImageByTag(query, dto.travel_location);
      itineraryData.images = image ? [image] : [];
    } catch (imageError) {
      this.logger?.warn?.(`Image fetch failed: ${imageError.message}`);
      itineraryData.images = [];
    }

    try {
      const itinerary = this.itineraryRepo.createItinerary({
        user_id: userId,
        travel_location: dto.travel_location,
        country: dto.country,
        content: itineraryData,
        type: 'STANDARD',
        source_questions_answers: dto.source_questions_answers,
      });

      const savedItinerary = await this.itineraryRepo.saveItinerary(itinerary);
      await this.featureManagementService.decrementUserFeatureCredit(
        userId,
        FeatureType.ITINERARY,
      );

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(ItineraryServiceMessages.USER_NOT_FOUND);
      }

      const { full_name, email } = user;
      const { subject, text, html } = itineraryNotificationTemplate(
        full_name,
        savedItinerary.id.toString(),
        dto.travel_location,
        dto.trip_duration,
      );

      try {
        await this.sendGridService.sendEmail({
          to: email,
          subject,
          text,
          html,
        });
      } catch (error) {
        throw new Error(ItineraryServiceMessages.EMAIL_SENDING_FAILED);
      }

      return itineraryData;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(ItineraryServiceMessages.ITINERARY_CREATION_FAILED);
    }
  }

  async getUserItineraries(userId: number, query: PaginationQueryDto) {
    try {
      const { page = 1, limit = 10 } = query;
      const { items, total } = await this.itineraryRepo.findUserItineraries(
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
    } catch (error) {
      throw new Error(ItineraryServiceMessages.USER_ITINERARIES_FETCH_FAILED);
    }
  }

  async getItineraryById(userId: number, itineraryId: number) {
    const itinerary = await this.itineraryRepo.findItineraryById(itineraryId);

    if (!itinerary) {
      throw new Error(ItineraryServiceMessages.ITINERARY_NOT_FOUND);
    }

    if (itinerary.user_id !== userId) {
      throw new Error(ItineraryServiceMessages.UNAUTHORIZED_ITINERARY_ACCESS);
    }

    return {
      id: itinerary.id,
      travel_location: itinerary.travel_location,
      country: itinerary.country,
      type: itinerary.type,
      created_at: itinerary.created_at,
      content: itinerary.content,
    };
  }

  async performBudgetPlanning(
    userId: number,
    itineraryId: number,
    inputs: any,
  ) {
    // Check itinerary existence and ownership
    const itinerary = await this.itineraryRepo.findItineraryById(itineraryId);
    if (!itinerary) {
      throw new Error(ItineraryFeatureMessages.ITINERARY_NOT_FOUND);
    }
    if (itinerary.user_id !== userId) {
      throw new Error(ItineraryFeatureMessages.UNAUTHORIZED_ITINERARY_ACCESS);
    }

    // Check budget plan credits
    const creditsInfo =
      await this.featureManagementService.getFeatureCredits(userId);
    const currentBudgetCredits =
      creditsInfo.feature_balances[FeatureType.BUDGET_PLAN] || 0;

    if (currentBudgetCredits <= 0) {
      throw new Error(ItineraryFeatureMessages.BUDGET_CREDITS_EXHAUSTED);
    }

    const prompt = this.budgetDirectiveService.generateBudgetPlanningPrompt(
      JSON.stringify(itinerary.content),
      inputs,
    );

    // console.log('Generated budget planning prompt:', prompt);
    const aiDto: AiRequestDto = {
      user_id: userId,
      api_type: FeatureType.BUDGET_PLAN,
      prompt: prompt,
    };

    const aiResponse = await this.geminiService.processAiRequest(aiDto);
    const rawText = aiResponse.data.candidates[0].content.parts[0].text;
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '');
    const budgetData = JSON.parse(cleanedText);

    const feature = this.itineraryFeatureRepo.createFeature({
      itinerary_id: itineraryId,
      feature_type: FeatureType.BUDGET_PLAN,
      inputs,
      content: budgetData,
    });
    await this.itineraryFeatureRepo.saveFeature(feature);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(ItineraryServiceMessages.USER_NOT_FOUND);
    }

      const { full_name, email } = user;
      const { subject, text, html } = budgetPlanningNotificationTemplate(full_name,"",itinerary.travel_location,itinerary.content.days.length)

    try {
      await this.sendGridService.sendEmail({
        to: email,
        subject,
        text,
        html,
      });
    } catch (error) {
      throw new Error(ItineraryServiceMessages.EMAIL_SENDING_FAILED);
    }

    await this.featureManagementService.decrementUserFeatureCredit(
      userId,
      FeatureType.BUDGET_PLAN,
    );

    return {
      message: 'Budget planning completed successfully.',
      data: budgetData,
    };
  }

  async performCustomItinerary(
    userId: number,
    itineraryId: number,
    featureData: FeatureInputDto,
  ) {
    const itinerary = await this.itineraryRepo.findItineraryById(itineraryId);
    if (!itinerary) {
      throw new Error(ItineraryFeatureMessages.ITINERARY_NOT_FOUND);
    }
    if (itinerary.user_id !== userId) {
      throw new Error(ItineraryFeatureMessages.UNAUTHORIZED_ITINERARY_ACCESS);
    }

    if (featureData.type !== 'CUSTOM_ITINERARY') {
      throw new Error(ItineraryFeatureMessages.INVALID_FEATURE_TYPE);
    }

    const customData = featureData.inputs as CustomItineraryInputDto;

    const creditsInfo =
      await this.featureManagementService.getFeatureCredits(userId);
    const currentCustomCredits =
      creditsInfo.feature_balances[FeatureType.CUSTOM_ITINERARY] || 0;
    console.log('Current custom itinerary credits:', currentCustomCredits);

    if (currentCustomCredits <= 0) {
      throw new Error(ItineraryFeatureMessages.CUSTOM_CREDITS_EXHAUSTED);
    }

    const originalContent = itinerary.content;

    const convertedDayCustomizations = customData?.day_wise_customizations?.map(
      (dto) => ({
        day: dto.day,
        general_instructions: dto.customization_text,
        customization_type: dto.customization_type || null,
      }),
    );

    const convertedGeneralCustomizations = customData?.general_customizations
      ? Array.isArray(customData.general_customizations)
        ? customData.general_customizations
          .map(
            (gc) =>
              `${gc.type}: ${gc.value}${gc.notes ? ` (${gc.notes})` : ''}`,
          )
          .join('; ')
        : String(customData.general_customizations)
      : undefined;

    const updatedItineraryRequest: CustomItineraryRequest = {
      ...(customData?.travel_location && {
        travel_location: customData.travel_location,
      }),
      ...(customData?.country && { country: customData.country }),
      ...(customData?.trip_duration && {
        trip_duration: customData.trip_duration,
      }),
      preferences:
        customData?.preferences || originalContent?.preferences || [],

      ...(convertedDayCustomizations &&
        convertedDayCustomizations.length > 0 && {
        day_wise_customizations: convertedDayCustomizations,
      }),

      ...(convertedGeneralCustomizations && {
        general_customizations: convertedGeneralCustomizations,
      }),
    };

    const prompt = this.customDirectiveService.generateCustomItineraryPrompt(
      JSON.stringify(originalContent),
      updatedItineraryRequest,
    );

    console.log('Generated custom itinerary prompt:', prompt);

    // Save result
    const aiDto: AiRequestDto = {
      user_id: userId,
      api_type: FeatureType.CUSTOM_ITINERARY,
      prompt: prompt,
    };

    try {
      const aiResponse = await this.geminiService.processAiRequest(aiDto);
      const rawText = aiResponse.data.candidates[0].content.parts[0].text;
      const cleanedText = rawText.replace(/```json\s*|\s*```/g, '');
      const customizedItinerary = JSON.parse(cleanedText);

      const newCustomItinerary = this.itineraryRepo.createItinerary({
        user_id: userId,
        travel_location: customizedItinerary.user_travel_location || updatedItineraryRequest.travel_location || 'Unknown',
        country: customizedItinerary.country_name || updatedItineraryRequest.country || 'Unknown',
        content: customizedItinerary,
        type: 'CUSTOM',
        source_questions_answers: customData || {},
      });

      const savedItinerary = await this.itineraryRepo.saveItinerary(newCustomItinerary);

      // Save result
      await this.featureManagementService.decrementUserFeatureCredit(
        userId,
        FeatureType.CUSTOM_ITINERARY,
      );

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(ItineraryFeatureMessages.USER_NOT_FOUND);
      }

      const { full_name, email } = user;

      //email notification for custom itinerary
      try {
        const { subject, text, html } = customItineraryNotificationTemplate(
          full_name,
          itineraryId.toString(),
          customizedItinerary.user_travel_location ||
          customizedItinerary.itinerary_title ||
          updatedItineraryRequest.travel_location ||
          'Your Destination',
          customizedItinerary.days?.length ||
          updatedItineraryRequest.trip_duration ||
          1,
          customizedItinerary,
        );

        await this.sendGridService.sendEmail({
          to: email,
          subject,
          text,
          html,
        });

        console.log(`Custom itinerary email sent successfully to ${email}`);
      } catch (emailError) {
        console.error('Failed to send custom itinerary email:', emailError);
      }

      return {
        statusCode: 201,
        message:
          'Custom itinerary generated successfully. A detailed copy has been sent to your email.',
        data: customizedItinerary,
      };
    } catch (error) {
      console.error('Error generating custom itinerary:', error);
      throw new Error(ItineraryFeatureMessages.CUSTOM_ITINERARY_FAILED);
    }
  }

  async performPackingList(
    userId: number,
    itineraryId: number,
    inputs: PackingListInputDto,
  ) {
    const itinerary = await this.itineraryRepo.findItineraryById(itineraryId);
    if (!itinerary) {
      throw new Error(ItineraryFeatureMessages.ITINERARY_NOT_FOUND);
    }
    if (itinerary.user_id !== userId) {
      throw new Error(ItineraryFeatureMessages.UNAUTHORIZED_ITINERARY_ACCESS);
    }
    const creditsInfo =
      await this.featureManagementService.getFeatureCredits(userId);
    const credits = creditsInfo.feature_balances[FeatureType.PACKING_LIST] || 0;
    if (credits <= 0) {
      throw new Error(ItineraryFeatureMessages.PACKING_CREDITS_EXHAUSTED);
    }
    const prompt = this.packingListDirectiveService.generatePackingListPrompt(
      JSON.stringify(itinerary.content),
      inputs,
    );

    const aiDto = {
      user_id: userId,
      api_type: FeatureType.PACKING_LIST,
      prompt,
    };

    const aiResponse = await this.geminiService.processAiRequest(aiDto);
    const candidate = aiResponse?.data?.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    if (!part?.text) {
      throw new Error(ItineraryFeatureMessages.AI_RESPONSE_INVALID);
    }
    const rawText = part.text;
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '').trim();
    let packingListData: any;

    try {
      packingListData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(ItineraryFeatureMessages.AI_JSON_PARSE_FAILED);
    }

    const feature = this.itineraryFeatureRepo.createFeature({
      itinerary_id: itineraryId,
      feature_type: FeatureType.PACKING_LIST,
      inputs,
      content: packingListData,
    });
    await this.itineraryFeatureRepo.saveFeature(feature);

    await this.featureManagementService.decrementUserFeatureCredit(
      userId,
      FeatureType.PACKING_LIST,
    );

    // Send email notification
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(ItineraryFeatureMessages.USER_NOT_FOUND);
      }

      const { full_name, email } = user;
      const travelLocation =
        itinerary?.content?.user_travel_location ||
        itinerary?.content?.itinerary_title ||
        'Your Destination';

      const { subject, text, html } = packingListNotificationTemplate(
        full_name,
        itineraryId.toString(),
        travelLocation,
        packingListData,
      );

      await this.sendGridService.sendEmail({
        to: email,
        subject,
        text,
        html,
      });

      console.log(`Packing list email sent successfully to ${email}`);
    } catch (emailError) {
      console.error('Failed to send packing list email:', emailError);
    }

    return {
      message: 'Packing list generated successfully.',
      data: packingListData,
    };
  }

  async getBudgetPlan(itineraryId: number, page = 1, limit = 10) {
    const { data: features, total } = await this.itineraryFeatureRepo.findByItineraryId(
      itineraryId,
      'BUDGET_PLAN',
      page,
      limit,
    );

    if (!features.length) {
      throw new NotFoundException('No budget plan found for this itinerary.');
    }

    return {
      total,
      page,
      limit,
      data: features.map((feature) => ({
        id: feature.id,
        budget_type: feature.content?.budget_type,
        user_travel_location: feature.content?.user_travel_location,
      })),
    };
  }

  async getPackingList(itineraryId: number, page = 1, limit = 10) {
    const { data: features, total } = await this.itineraryFeatureRepo.findByItineraryId(
      itineraryId,
      'PACKING_LIST',
      page,
      limit,
    );

    if (!features.length) {
      throw new NotFoundException('No packing list found for this itinerary.');
    }

    return {
      total,
      page,
      limit,
      data: features.map((feature) => ({
        id: feature.id,
        destination: feature.content?.destination,
        general_tips: feature.content?.general_tips,
      })),
    };
  }

  async getFeatureById(itineraryId: number, featureId: number) {
    const feature = await this.itineraryFeatureRepo.findOneByItineraryAndFeatureId(itineraryId, featureId);

    if (!feature) {
      throw new NotFoundException('Feature not found for this itinerary.');
    }

    return {
      id: feature.id,
      feature_type: feature.feature_type,
      itinerary_id: feature.itinerary_id,
      content: feature.content,
      inputs: feature.inputs,
      created_at: feature.created_at,
    };
  }
}