import { Controller, Post, Body, Res, HttpStatus, BadRequestException, InternalServerErrorException, UnauthorizedException, ForbiddenException, ConflictException, Get, UseGuards, NotFoundException  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerSignup } from './decorators/swagger/signup.decorator';
import { AuthServiceMessages } from './constants/auth.service.messages';
import { LoginDto } from './dto/login.dto';
import { SwaggerLogin } from './decorators/swagger/login.decorator';
import { ReviewRequestDto } from './dto/review-request.dto';
import { ReviewRequestSwagger } from './decorators/swagger/request-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @SwaggerSignup()
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(createUserDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: AuthServiceMessages.SIGNUP_SUCCESS,
      });
    } catch (error) {
      const message = error.message;
      console.error('Signup error:', message);

      switch (message) {
        case AuthServiceMessages.EMAIL_OR_USERNAME_EXISTS:
          throw new BadRequestException(message);
        default:
          throw new InternalServerErrorException(message);
      }
    }
  }

  @Post('login')
  @SwaggerLogin()
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: AuthServiceMessages.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case AuthServiceMessages.INVALID_CREDENTIALS:
          throw new UnauthorizedException(message);
        case AuthServiceMessages.ACCOUNT_SUSPENDED:
          throw new ForbiddenException(message);
        case AuthServiceMessages.EMAIL_NOT_VERIFIED:
          throw new UnauthorizedException(message);
        default:
          throw new InternalServerErrorException(message);
      }
    }
  }

  @Post('review-request')
  @ReviewRequestSwagger()
  async requestReview(@Body() reviewRequestDto: ReviewRequestDto, @Res() res: Response,) {
    try {
      await this.authService.requestReview(reviewRequestDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: AuthServiceMessages.REVIEW_REQUEST_SUBMITTED,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case AuthServiceMessages.USER_NOT_FOUND_OR_NOT_SUSPENDED:
        case AuthServiceMessages.NO_SUSPENSION_RECORD:
          throw new NotFoundException(message);
        case AuthServiceMessages.ALREADY_REQUESTED:
          throw new ConflictException(message);
        default:
          throw new InternalServerErrorException(message);
      }
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {

  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const result = await this.authService.signInWithGoogle(req.user);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: AuthServiceMessages.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      const message = error?.message || 'Unexpected error occurred during Google login';
      console.error('Google login error:', message);

      throw new InternalServerErrorException(message);
    }
  }
}