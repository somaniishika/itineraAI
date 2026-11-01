import {
  Controller, Get, Query, UseGuards, Res, HttpStatus, Logger, Put, Body, Param, ParseIntPipe, Post, Req, HttpCode, Delete, InternalServerErrorException, BadRequestException, NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth,ApiOperation,ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { GetSuspensionRequestsDto } from './dtos/get-suspension-requests.dto';
import { GetSuspensionRequestsSwaggerDocs } from './decorators/swagger/suspension-requests.swagger';
import { Response } from 'express';
import { UserStatusSwaggerDocs } from './decorators/swagger/update-user-status.swagger';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { GetUsersSwaggerDocs } from './decorators/swagger/admin-user.decorator';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { AdminMessages } from './constants/admin.messages';
import { GetProfileDetailsSwaggerDocs } from './decorators/swagger/admin-profile.decorator';
import { AdminQuestionnaireService } from './services/admin-questionnaire.service';
import { QuestionnaireResponseDto } from './dtos/questionnaire-response.dto';
import { CreateQuestionnaireDto } from './dtos/create-questionnaire.dto';
import { GetAllQuestionnairesSwagger } from './decorators/swagger/questionnaire.decorator';
import { AddQuestionnaireSwagger } from './decorators/swagger/add-questionnaire.decorator';
import { UpdateQuestionnaireDto } from './dtos/update-questionnaire.dto';
import { EditQuestionnaireQuestionSwagger } from './decorators/swagger/edit-questionnaire.decorator';
import { DeleteQuestionnaireQuestionSwagger } from './decorators/swagger/delete-questionnaire.decorator';
import { Request } from 'express';
import { QuestionnaireServiceMessages } from './constants/questionnaire.messages';
import { GetApiAuditLogDto } from './dtos/get-api-audit-log.dto';
import { GetApiAuditLogsSwagger } from './decorators/swagger/api-audit-log.decorator';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly adminQuestionnaireService: AdminQuestionnaireService,
  ) { }

  @Put('user-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UserStatusSwaggerDocs()
  async suspendOrReactivateUser(
    @Query('status') status: 'suspend' | 'reactivate',
    @Body() dto: UpdateUserStatusDto,) {
    try {
      return await this.adminService.suspendOrReactivateUser(status, dto);
    } catch (error) {
      const message = error?.message;

      switch (message) {
        case AdminMessages.USER_NOT_FOUND:
        case AdminMessages.SUSPENSION_REQUEST_NOT_FOUND:
          throw new NotFoundException(message);

        case AdminMessages.ADMIN_USER_CANNOT_BE_MODIFIED:
        case AdminMessages.USER_ALREADY_SUSPENDED:
        case AdminMessages.USER_ALREADY_ACTIVE:
        case AdminMessages.INVALID_STATUS:
          throw new BadRequestException(message);

        default:
          throw new InternalServerErrorException(AdminMessages.UNEXPECTED_ERROR);
      }
    }
  }


  @Get('suspension-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @GetSuspensionRequestsSwaggerDocs()
  async getRequests(
    @Query() query: GetSuspensionRequestsDto,
    @Res() res: Response,
  ) {
    this.logger.log(`Admin requested suspension requests list`);

  try {
    const result = await this.adminService.getSuspensionRequests(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Suspension requests fetched successfully ',
      ...result,
    });
  } catch (error) {
  const message = error?.message;
  let errorType = 'UNKNOWN';

      if (message?.startsWith('No suspension requests found with status')) {
        errorType = 'NOT_FOUND';
      }

      switch (errorType) {
        case 'NOT_FOUND':
          throw new NotFoundException(message);

        default:
          this.logger.error(`Unexpected error while fetching suspension requests`, error);
          throw new InternalServerErrorException(AdminMessages.UNEXPECTED_ERROR);
      }
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @GetUsersSwaggerDocs()
  async getUsers(
    @Query() query: GetUsersQueryDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.adminService.getUsers(query);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: AdminMessages.FETCH_USERS_SUCCESS,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case AdminMessages.USER_NOT_FOUND:
          throw new NotFoundException(message);
        case AdminMessages.USER_ACCESS_FORBIDDEN:
          throw new ForbiddenException(message);
        case AdminMessages.USER_VALIDATION_FAILED:
          throw new BadRequestException(message);
        default:
          throw new InternalServerErrorException(message);
      }
    }
  }


  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @GetProfileDetailsSwaggerDocs()
  async getUserDetails(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.adminService.getFullUserDetails(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: AdminMessages.FETCH_USER_DETAIL_SUCCESS,
        data: result,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case AdminMessages.USER_NOT_FOUND:
          throw new NotFoundException(message);

        case AdminMessages.USER_ACCESS_FORBIDDEN:
          throw new ForbiddenException(message);

        case AdminMessages.USER_VALIDATION_FAILED:
        case AdminMessages.INVALID_STATUS:
          throw new BadRequestException(message);

        case AdminMessages.ADMIN_USER_CANNOT_BE_MODIFIED:
        case AdminMessages.USER_ALREADY_SUSPENDED:
        case AdminMessages.USER_ALREADY_ACTIVE:
        case AdminMessages.USER_SUSPENDED_SUCCESS:
        case AdminMessages.USER_REACTIVATED_SUCCESS:
          throw new BadRequestException(message);

        default:
          throw new InternalServerErrorException(message);
      }
    }
  }

  @Get('questionnaire')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @GetAllQuestionnairesSwagger()
  async getAllQuestions(): Promise<QuestionnaireResponseDto[]> {
    try {
      return await this.adminQuestionnaireService.getAllQuestions();
    } catch (error) {
      switch (error.message) {
        case QuestionnaireServiceMessages.QUESTIONNAIRE_FETCH_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Post('questionnaire')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @AddQuestionnaireSwagger()
  async addQuestion(
    @Body() dto: CreateQuestionnaireDto,
    @Req() req: Request,
  ): Promise<QuestionnaireResponseDto> {
    const adminUserId = (req as any).user.id;
    try {
      return await this.adminQuestionnaireService.addQuestion(dto, adminUserId);
    } catch (error) {
      switch (error.message) {
        case QuestionnaireServiceMessages.OPTIONS_REQUIRED:
          throw new BadRequestException(error.message);
        case QuestionnaireServiceMessages.QUESTIONNAIRE_CREATION_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Put('questionnaire/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @EditQuestionnaireQuestionSwagger()
  async editQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionnaireDto,
    @Req() req: Request,
  ): Promise<QuestionnaireResponseDto> {
    const adminUserId = (req as any).user.id;
    try {
      return await this.adminQuestionnaireService.editQuestion(id, dto, adminUserId);
    } catch (error) {
      switch (error.message) {
        case QuestionnaireServiceMessages.QUESTION_NOT_FOUND:
          throw new NotFoundException(error.message);
        case QuestionnaireServiceMessages.DEFAULT_QUESTION_EDIT_FORBIDDEN:
        case QuestionnaireServiceMessages.OPTIONS_REQUIRED:
          throw new BadRequestException(error.message);
        case QuestionnaireServiceMessages.QUESTIONNAIRE_UPDATE_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Delete('questionnaire/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteQuestionnaireQuestionSwagger()
  async deleteQuestion(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.adminQuestionnaireService.deleteQuestion(id);
    } catch (error) {
      switch (error.message) {
        case QuestionnaireServiceMessages.QUESTION_NOT_FOUND:
          throw new NotFoundException(error.message);
        case QuestionnaireServiceMessages.DEFAULT_QUESTION_DELETE_FORBIDDEN:
          throw new BadRequestException(error.message);
        case QuestionnaireServiceMessages.QUESTIONNAIRE_DELETE_FAILED:
          throw new InternalServerErrorException(error.message);
        default:
          throw error;
      }
    }
  }

  @Get('api-audit-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get API Audit Logs (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @GetApiAuditLogsSwagger()
  async getApiAuditLogs(
    @Query() query: GetApiAuditLogDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: any[];
    meta: any;
  }> {
    try {
      const result = await this.adminService.getApiAuditLogs(query);
      return {
        success: true,
        message: 'Audit logs fetched successfully',
        data: result.data,
        meta: result.meta,
      };
    } catch (error) {
      this.logger.error('Failed to fetch API audit logs', error);

      switch (error.message) {
        case 'INVALID_PAGINATION_PARAMS':
          throw new BadRequestException('Invalid pagination parameters');
        case 'AUDIT_LOGS_FETCH_FAILED':
          throw new InternalServerErrorException('Failed to retrieve audit logs');
        default:
          throw new InternalServerErrorException(
            'Unexpected error occurred while fetching audit logs',
          );
      }
    }
  }
}