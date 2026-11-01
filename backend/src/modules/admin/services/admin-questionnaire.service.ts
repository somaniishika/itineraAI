import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QuestionnaireRepository } from '../repositories/questionnaire.repository';
import { QuestionnaireResponseDto } from '../dtos/questionnaire-response.dto';
import { CreateQuestionnaireDto } from '../dtos/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from '../dtos/update-questionnaire.dto';
import { FieldTypeQuestions } from 'src/modules/itinerary/entities/questionnaire.entity';
import { QuestionnaireServiceMessages } from '../constants/questionnaire.messages';

@Injectable()
export class AdminQuestionnaireService {
  constructor(
    private readonly questionnaireRepository: QuestionnaireRepository,
  ) {}

  async getAllQuestions(): Promise<QuestionnaireResponseDto[]> {
    try {
      const questions = await this.questionnaireRepository.getAllQuestions();
      return questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        field_type: q.field_type,
        options: q.options,
        image_url: q.image_url,
        is_default: q.is_default,
        created_by: q.created_by,
        created_at: q.created_at,
        updated_at: q.updated_at,
      }));
    } catch (error) {
      throw new Error(QuestionnaireServiceMessages.QUESTIONNAIRE_FETCH_FAILED);
    }
  }

  async addQuestion(
    dto: CreateQuestionnaireDto,
    adminUserId: number,
  ): Promise<QuestionnaireResponseDto> {
    try {
      if (
        ['dropdown', 'radio', 'checkbox'].includes(dto.field_type) &&
        (!dto.options || dto.options.length === 0)
      ) {
        throw new Error(QuestionnaireServiceMessages.OPTIONS_REQUIRED);
      }

      const createdQuestion = await this.questionnaireRepository.createQuestion(
        {
          question_text: dto.question_text,
          field_type: dto.field_type as FieldTypeQuestions,
          options: dto.options,
          image_url: dto.image_url,
          is_default: false,
          created_by: adminUserId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      );

      return {
        id: createdQuestion.id,
        question_text: createdQuestion.question_text,
        field_type: createdQuestion.field_type,
        options: createdQuestion.options,
        image_url: createdQuestion.image_url,
        is_default: createdQuestion.is_default,
        created_by: createdQuestion.created_by,
        created_at: createdQuestion.created_at,
        updated_at: createdQuestion.updated_at,
      };
    } catch (error) {
      if (error.message === QuestionnaireServiceMessages.OPTIONS_REQUIRED) throw error;
      throw new Error(QuestionnaireServiceMessages.QUESTIONNAIRE_CREATION_FAILED);
    }
  }

  async editQuestion(
    id: number,
    dto: UpdateQuestionnaireDto,
    adminUserId: number,
  ): Promise<QuestionnaireResponseDto> {
    const question = await this.questionnaireRepository.findById(id);

    if (!question) {
      throw new Error(QuestionnaireServiceMessages.QUESTION_NOT_FOUND);
    }

    if (question.is_default) {
      throw new Error(QuestionnaireServiceMessages.DEFAULT_QUESTION_EDIT_FORBIDDEN);
    }

    if (
      dto.field_type &&
      ['dropdown', 'radio', 'checkbox'].includes(dto.field_type) &&
      (!dto.options || dto.options.length === 0)
    ) {
      throw new Error(QuestionnaireServiceMessages.OPTIONS_REQUIRED);
    }

    try {
      const updatedQuestion = await this.questionnaireRepository.updateQuestion(
        id,
        {
          ...dto,
          updated_at: new Date(),
        },
      );

      return {
        id: updatedQuestion!.id,
        question_text: updatedQuestion!.question_text,
        field_type: updatedQuestion!.field_type,
        options: updatedQuestion!.options,
        image_url: updatedQuestion!.image_url,
        is_default: updatedQuestion!.is_default,
        created_by: updatedQuestion!.created_by,
        created_at: updatedQuestion!.created_at,
        updated_at: updatedQuestion!.updated_at,
      };
    } catch (error) {
      throw new Error(QuestionnaireServiceMessages.QUESTIONNAIRE_UPDATE_FAILED);
    }
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await this.questionnaireRepository.findById(id);

    if (!question) {
      throw new Error(QuestionnaireServiceMessages.QUESTION_NOT_FOUND);
    }

    if (question.is_default) {
      throw new Error(QuestionnaireServiceMessages.DEFAULT_QUESTION_DELETE_FORBIDDEN);
    }

    try {
      await this.questionnaireRepository.deleteById(id);
    } catch (error) {
      throw new Error(QuestionnaireServiceMessages.QUESTIONNAIRE_DELETE_FAILED);
    }
  }
}
