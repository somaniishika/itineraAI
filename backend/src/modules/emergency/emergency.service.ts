import {Injectable,InternalServerErrorException,Logger,NotFoundException} from '@nestjs/common';
import { EmergencyContactRepository } from './repositories/emergency-contact.repository';
import { EmergencyPromptService } from './service/emergency-prompt.service';
import { AiService } from '../provider/ai-model/ai.service';
import { AiRequestDto } from '../provider/ai-model/dto/ai-request.dto';
import { SendGridService } from '../provider/sendgrid/sendgrid.service';
import { emergencyContactTemplate } from '../provider/sendgrid/templates/emergency-detail.template';
import { UserRepository } from '../users/repositories/users.repository';
import { GetEmergencyContactsDto } from './dto/get-emergency-contact.dto';
import { EmergencyAIResponseDto } from './dto/emergency-ai-response.dto';
import { FeatureManagementService } from '../feature-management/feature-management.service';
import { EmergencyServiceMessages } from './constants/emergency.messages';

@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);

  constructor(
    private readonly emergencyContactRepo: EmergencyContactRepository,
    private readonly emergencyPromptService: EmergencyPromptService,
    private readonly aiService: AiService,
    private readonly sendGridService: SendGridService,
    private readonly userRepository: UserRepository,
    private readonly featureManagementService: FeatureManagementService, // 👈 Injected
  ) {}

  async getOrGenerateEmergencyContacts(
    userId: number,
    dto: GetEmergencyContactsDto,
  ): Promise<EmergencyAIResponseDto> {
    try {
      // 1. Check credits
      const creditsInfo =
        await this.featureManagementService.getFeatureCredits(userId);
      const emergencyCredits =
        creditsInfo.feature_balances['EMERGENCY_CONTACT'] || 0;

      this.logger.log(
        `User ${userId} has ${emergencyCredits} EMERGENCY_CONTACT credits.`,
      );

      if (emergencyCredits <= 0) {
        throw new Error(EmergencyServiceMessages.NO_CREDITS);
      }

      // 2. Check cache
      const existingContacts = await this.emergencyContactRepo.findByLocation(
        dto.location,
      );

      if (existingContacts) {
        this.logger.log(
          `Returning cached emergency contacts for ${dto.location}`,
        );

        await this.sendEmergencyContactsEmail(
          userId,
          existingContacts.contact_details as unknown as EmergencyAIResponseDto,
        );

        return existingContacts.contact_details as unknown as EmergencyAIResponseDto;
      }

      // 3. Generate new contacts
      this.logger.log(`Generating new emergency contacts for ${dto.location}`);

      const prompt =
        this.emergencyPromptService.generateEmergencyContactsPrompt(
          dto.location,
        );

      const aiDto: AiRequestDto = {
        user_id: userId,
        api_type: 'EMERGENCY_CONTACT',
        prompt: prompt,
      };

      const aiResponse = await this.aiService.processAiRequest(aiDto);
      const rawText = aiResponse.data.candidates[0].content.parts[0].text;
      const cleanedText = rawText.replace(/```json\s*|\s*```/g, '');
      const emergencyData: EmergencyAIResponseDto = JSON.parse(cleanedText);

      // 4. Save and decrement credits
      await this.emergencyContactRepo.saveEmergencyContacts(
        userId,
        dto.location,
        emergencyData,
      );

      await this.featureManagementService.decrementUserFeatureCredit(
        userId,
        'EMERGENCY_CONTACT',
      );

      await this.sendEmergencyContactsEmail(userId, emergencyData);

      this.logger.log(
        `Emergency contacts generated, cached, and credits decremented for ${dto.location}`,
      );

      return emergencyData;
    } catch (error) {
      this.logger.error(
        `Failed to get/generate emergency contacts: ${error.message}`,
      );
      throw new InternalServerErrorException(
        EmergencyServiceMessages.GENERIC_ERROR,
      );
    }
  }

  private async sendEmergencyContactsEmail(
    userId: number,
    emergencyData: EmergencyAIResponseDto,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logger.warn(`User with id ${userId} not found for email notification`);
        return;
      }

      const { subject, text, html } = emergencyContactTemplate(
        user.full_name,
        emergencyData.location,
        emergencyData.emergency_contacts,
      );

      await this.sendGridService.sendEmail({
        to: user.email,
        subject,
        text,
        html,
      });

      this.logger.log(`Emergency contacts email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send emergency contacts email: ${error.message}`,
      );
    }
  }
}
