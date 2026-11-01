import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendOtpDto, SendOtpDtoPublic } from './dto/send-otp.dto';
import { Request } from 'express';
import { VerifyOtpOpenDto } from './dto/verify-otp-open.dto';
import { VerifyOtpAuthDto } from './dto/verify-otp-auth-dto';
import { SwaggerSendOtpPublic } from './decorators/swagger/send-otp.decorator';
import { SwaggerSendOtpEmailChange } from './decorators/swagger/send-email-change.decorator';
import { VerifyOtpOpenSwagger } from './decorators/swagger/verify-open.decorator';
import { VerifyOtpAuthSwagger } from './decorators/swagger/verify-auth.decorator';
import { OtpServiceMessages } from './constant/otp.service.message';

@Controller('otp')
@ApiTags('OTP')
@ApiBearerAuth('access-token')
export class OtpController {
  constructor(private readonly otpService: OtpService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @SwaggerSendOtpPublic()
  async sendOtpPublic(@Body() body: SendOtpDtoPublic) {
    try {

      const result = await this.otpService.handleOtpRequest(null, body.email, body.purpose);
      return { message: 'OTP sent successfully', data: result };

    } catch (error) {

      switch (error.message) {
        case OtpServiceMessages.USER_NOT_FOUND:
          throw new NotFoundException(error.message);
        case OtpServiceMessages.OTP_LIMIT_EXHAUSTED:
          throw new ConflictException(error.message)
        case OtpServiceMessages.EMAIL_ALREADY_VERIFIED:
          throw new ConflictException(error.message);
        default:
          throw error;
      }

    }
  }

  @Post('email-change')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @HttpCode(HttpStatus.OK)
  @SwaggerSendOtpEmailChange()
  async sendOtpForEmailChange(@Req() req: Request, @Body() body: SendOtpDto) {
    const userId = (req.user as any)?.id;
    try {
          const result = await this.otpService.handleOtpRequest(userId, body.email, body.purpose);
          return { message: 'OTP sent successfully', data: result };
        } catch (error) {
          switch (error.message) {
            case OtpServiceMessages.USER_NOT_FOUND:
              throw new NotFoundException(error.message);
            case OtpServiceMessages.EMAIL_IN_USE:
            case OtpServiceMessages.EMAIL_ALREADY_VERIFIED:
            case OtpServiceMessages.OTP_LIMIT_EXHAUSTED:
              throw new ConflictException(error.message);
            default:
              throw error;
          }
        }
    }

  @Post('_verify')
  @HttpCode(HttpStatus.OK)
  @VerifyOtpOpenSwagger()
  async verifyOtpOpen(@Body() dto: VerifyOtpOpenDto) {
    try {
      return await this.otpService.verifyOtpOpen(dto);
    } catch (error) {
      switch (error.message) {
        case OtpServiceMessages.USER_NOT_FOUND:
          throw new NotFoundException(error.message);
        case OtpServiceMessages.INVALID_OR_EXPIRED_OTP:
        case OtpServiceMessages.NEW_PASSWORD_REQUIRED:
        case OtpServiceMessages.UNSUPPORTED_PURPOSE:
          throw new BadRequestException(error.message);
        case OtpServiceMessages.EMAIL_ALREADY_VERIFIED:
          throw new ConflictException(error.message);
        default:
          throw error;
      }
    }
  }

  @Post('_verify-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @HttpCode(HttpStatus.OK)
  @VerifyOtpAuthSwagger()
  async verifyOtpAuth(@Req() req: Request, @Body() dto: VerifyOtpAuthDto) {
    const userId = (req.user as any)?.id;
    try {
      return await this.otpService.verifyOtpAuth(userId, dto);
    } catch (error) {
      switch (error.message) {
        case OtpServiceMessages.USER_NOT_FOUND:
          throw new NotFoundException(error.message);
        case OtpServiceMessages.INVALID_OR_EXPIRED_OTP:
        case OtpServiceMessages.EMAIL_IN_USE:
          throw new BadRequestException(error.message);
        default:
          throw error;
      }
    }
  }
}
