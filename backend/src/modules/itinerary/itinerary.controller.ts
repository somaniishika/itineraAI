import { BadRequestException, Body, Controller, ForbiddenException, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItineraryService } from './itinerary.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetQuestionsWithAnswersSwagger } from './decorators/swagger/questionnaire.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { GenerateItinerarySwagger } from './decorators/swagger/generate-itinerary.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { GetUserItinerariesSwagger } from './decorators/swagger/user-itineraries.decorator';
import { GetItineraryByIdSwagger } from './decorators/swagger/itinerary-details.decorator';
import { FeatureInputDto } from './dto/feature-input-dto';
import { PerformItineraryFeatureSwagger } from './decorators/swagger/itinerary-feature.decorator';
import { ItineraryServiceMessages } from './constant/itinerary.constants';
import { ItineraryFeatureMessages } from './constant/itinerary-feature.messages';
import { SwaggerGetFeatureById, SwaggerGetFeaturesByItineraryId } from './decorators/swagger/itinerary-by-id-feature';

@Controller('itinerary')
@ApiTags('Itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) { }

  @Get('questions')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @GetQuestionsWithAnswersSwagger()
  async getQuestionsWithAnswers(@Req() req: any) {
    const userId = parseInt((req.user as any)?.id);
    console.log(`Fetching questions for user ID: ${userId}`);
    try {
      return await this.itineraryService.getQuestionsWithAnswers(userId);
    } catch (error) {
      switch (error.message) {
        case ItineraryServiceMessages.QUESTIONS_FETCH_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Post('')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @GenerateItinerarySwagger()
  async generateItinerary(@Req() req: any, @Body() dto: CreateItineraryDto) {
    const userId = parseInt((req.user as any)?.id);
    try {
      return await this.itineraryService.createItinerary(userId, dto);
    } catch (error) {
      switch (error.message) {
        case ItineraryServiceMessages.INSUFFICIENT_CREDITS:
          throw new ForbiddenException(error.message);
        case ItineraryServiceMessages.AI_RESPONSE_INVALID:
        case ItineraryServiceMessages.ITINERARY_CREATION_FAILED:
          throw new InternalServerErrorException(error.message);
        case ItineraryServiceMessages.USER_NOT_FOUND:
          throw new NotFoundException(error.message);
        case ItineraryServiceMessages.EMAIL_SENDING_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @GetUserItinerariesSwagger()
  async getUserItineraries(
    @Req() req: any,
    @Query() query: PaginationQueryDto,
  ) {
    const userId = parseInt((req.user as any)?.id);
    try {
      return await this.itineraryService.getUserItineraries(userId, query);
    } catch (error) {
      switch (error.message) {
        case ItineraryServiceMessages.USER_ITINERARIES_FETCH_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @GetItineraryByIdSwagger()
  async getItineraryById(@Req() req: any, @Param('id') id: string) {
    const userId = parseInt((req.user as any)?.id);
    const itineraryId = parseInt(id);
    try {
      return await this.itineraryService.getItineraryById(userId, itineraryId);
    } catch (error) {
      switch (error.message) {
        case ItineraryServiceMessages.ITINERARY_NOT_FOUND:
          throw new NotFoundException(error.message);
        case ItineraryServiceMessages.UNAUTHORIZED_ITINERARY_ACCESS:
          throw new ForbiddenException(error.message);
        default:
          throw error;
      }
    }
  }

  @Post('feature/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @PerformItineraryFeatureSwagger()
  async performItineraryOperation(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: FeatureInputDto,
  ) {
    const userId = parseInt((req.user as any).id);
    const itineraryId = parseInt(id);

    try {
    switch (body.type) {
      case 'BUDGET_PLAN':
        return await this.itineraryService.performBudgetPlanning(
          userId,
          itineraryId,
          body,
        );
      case 'CUSTOM_ITINERARY':
        return await this.itineraryService.performCustomItinerary(
          userId,
          itineraryId,
          body,
        );
      case 'PACKING_LIST':
        if(parseInt(body.inputs['number_of_people'])>8) throw new BadRequestException('Max limit for number of people in PACKING_LIST can not exceed 8')
        return await this.itineraryService.performPackingList(
          userId,
          itineraryId,
          body.inputs,
        );
      default:
        throw new BadRequestException('Feature type not implemented yet.');
    }
  } catch (error) {
    switch (error.message) {
      case ItineraryFeatureMessages.ITINERARY_NOT_FOUND:
      case ItineraryFeatureMessages.USER_NOT_FOUND:
        throw new NotFoundException(error.message);

        case ItineraryFeatureMessages.INVALID_FEATURE_TYPE:
          throw new BadRequestException(error.message);

        case ItineraryFeatureMessages.AI_RESPONSE_INVALID:
        case ItineraryFeatureMessages.AI_JSON_PARSE_FAILED:
        case ItineraryFeatureMessages.CUSTOM_ITINERARY_FAILED:
          throw new InternalServerErrorException(error.message);

        default:
          throw error;
      }
    }
  }

  @Get('feature/:itineraryId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerGetFeaturesByItineraryId()
  async getFeatureByItineraryId(
    @Param('itineraryId') itineraryId: string,
    @Query('type') type: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const id = parseInt(itineraryId);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    switch (type) {
      case 'BUDGET_PLAN':
        return this.itineraryService.getBudgetPlan(id, pageNum, limitNum);
      case 'PACKING_LIST':
        return this.itineraryService.getPackingList(id, pageNum, limitNum);
      default:
        throw new BadRequestException('Unsupported or missing feature type.');
    }
  }

  @Get(':itineraryId/features/:featureId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerGetFeatureById()
  async getFeatureById(
    @Param('itineraryId', ParseIntPipe) itineraryId: number,
    @Param('featureId', ParseIntPipe) featureId: number,
  ) {
    const data = await this.itineraryService.getFeatureById(itineraryId, featureId);
    return {
      success: true,
      message: 'Feature fetched successfully',
      data,
    };
  }
}