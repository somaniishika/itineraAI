import { Controller, Post, Body, Res, HttpStatus, UseGuards, Req, Get, Query, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/submit-feedback.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SwaggerSubmitFeedback, SwaggerGetAllFeedbacks } from './decorators/swagger.decorator';
import { FeedbackMessages } from './constants/feedback.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetFeedbacksDto } from './dto/get-feedbacks.dto';
import { Response } from 'express';

@ApiTags('Feedback')
@Controller('/feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  @Roles('USER')
  @SwaggerSubmitFeedback()
  async submitFeedback(
    @Req() req: Request,
    @Body() dto: CreateFeedbackDto,
    @Res() res: Response,
  ) {
    const user = req.user as any;

    try {
      const feedback = await this.feedbackService.submitFeedback(user.id, dto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: FeedbackMessages.FEEDBACK_SUCCESS,
        data: feedback,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case FeedbackMessages.LIMIT_REACHED:
          throw new ForbiddenException(message);
        default:
          throw new InternalServerErrorException(
            message || FeedbackMessages.FAILED_FEEDBACK_SUBMISSION,
          );
      }
    }
  }


  @Get()
  @Roles('ADMIN')
  @SwaggerGetAllFeedbacks()
  async getAllFeedbacks(@Query() query: GetFeedbacksDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const rating = query.rating;

    try {
      const { data, total, totalPages } = await this.feedbackService.getAllFeedbacks(page, limit, rating);

      return {
        success: true,
        message: FeedbackMessages.FETCH_FEEDBACK_SUCCESS,
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || FeedbackMessages.FAILED_TO_FETCH_FEEDBACKS,
      );
    }
  }
}