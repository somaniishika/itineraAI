import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRepository } from '../users/repositories/users.repository';
import { comparePasswords, hashPassword } from './utils/auth.utils';
import { OtpService } from '../otp/otp.service';
import { AuthServiceMessages } from './constants/auth.service.messages';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ReviewRequestDto } from './dto/review-request.dto';
import { SuspensionRequestRepository } from '../users/repositories/suspension-request.repository';
import { FeatureManagementService } from '../feature-management/feature-management.service';
import { OtpServiceMessages } from '../otp/constant/otp.service.message';
import { SendGridService } from '../provider/sendgrid/sendgrid.service';
import { welcomeEmailAuthTemplate } from '../provider/sendgrid/templates/welcome-auth.template';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly suspensionRequestRepository: SuspensionRequestRepository,
    private readonly featureManagementService: FeatureManagementService,
    private readonly sendGridService: SendGridService,
  ) { }

  async signup(createUserDto: CreateUserDto): Promise<void> {
    const { password, email, username } = createUserDto;

    if (!email || !username || !password) {
      throw new BadRequestException('Email, username, and password are required.');
    }

    const existingUser = await this.userRepository.findByEmailOrUsername(email, username);
    if (existingUser) {
      throw new ConflictException(AuthServiceMessages.EMAIL_OR_USERNAME_EXISTS);
    }

    const passwordHash = await hashPassword(password);

    const userData = {
      ...createUserDto,
      password: passwordHash,
    };

    const user = await this.userRepository.create(userData);

    await this.featureManagementService.grantInitialItineraryCredits(
      user.id,
      OtpServiceMessages.FREE_ITINERARY_CREDITS,
    );

    await this.otpService.sendOtp(user.id, 'VERIFY_EMAIL', user.email, user.full_name);
  }

  async login(loginDto: LoginDto) {
    const { emailOrUsername, password } = loginDto;

    const user = await this.userRepository.findByEmailOrUsername(
      emailOrUsername,
      emailOrUsername,
    );

    if (!user || user.is_deleted || !user.password_hash) {
      throw new Error(AuthServiceMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new Error(AuthServiceMessages.INVALID_CREDENTIALS);
    }

    if (user.is_suspended) {
      throw new Error(AuthServiceMessages.ACCOUNT_SUSPENDED);
    }

    if (!user.email_verified) {
      await this.otpService.sendOtp(user.id, 'VERIFY_EMAIL', user.email, user.full_name);

      throw new Error(AuthServiceMessages.EMAIL_NOT_VERIFIED);
    }

    const payload = {
      sub: user.id,
      email: user.email!,
      fullname: user.full_name!,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  async requestReview(dto: ReviewRequestDto): Promise<void> {
    const { email, message } = dto;

    const user = await this.userRepository.findByEmailWithSuspensionRequest(email);

    if (!user || !user.is_suspended) {
      throw new Error(AuthServiceMessages.USER_NOT_FOUND_OR_NOT_SUSPENDED);
    }

    const suspensionRequest = user.suspension_request;
    if (!suspensionRequest) {
      throw new Error(AuthServiceMessages.NO_SUSPENSION_RECORD);
    }

    if (suspensionRequest.user_request_message) {
      throw new Error(AuthServiceMessages.ALREADY_REQUESTED);;
    }

    suspensionRequest.user_request_message = message;

    await this.suspensionRequestRepository.save(suspensionRequest);
  }

  async signInWithGoogle(googleUser: any) {
    const { email, firstName, lastName, picture } = googleUser;

    let user = await this.userRepository.findByEmail(email);

    const isFirstTime = !user;

    if (!user) {
      user = await this.userRepository.createGoogleUser({
        email,
        full_name: `${firstName} ${lastName}`,
        profile_picture: picture,
        provider: 'google',
        email_verified: true,
      });
    }

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    const userEmail = user.email || email;
    const userFullName = user.full_name || `${firstName} ${lastName}`;

    if (!userEmail || !userFullName) {
      throw new Error('User missing required fields');
    }

    const payload = {
      sub: user.id,
      email: userEmail,
      fullname: userFullName,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    if (isFirstTime) {
      await this.featureManagementService.grantInitialItineraryCredits(
        user.id,
        OtpServiceMessages.FREE_ITINERARY_CREDITS,
      );
      await this.featureManagementService.creditFeatureToUser(
        user.id,
        'EMERGENCY_CONTACT',
        OtpServiceMessages.FREE_EMERGENCY_CREDITS,
      );

      this.logger.log(`User ${email} credited with free feature credits on first login.`);

      try {
        const { full_name, email } = user;

        const { subject, text, html } = welcomeEmailAuthTemplate(full_name);

        await this.sendGridService.sendEmail({
          to: email,
          subject,
          text,
          html,
        });

        this.logger.log(`Welcome email sent to ${email}`);
      } catch (err) {
        this.logger.error(`Failed to send welcome email to ${user.email}`, err);
      }
    }

    return {
      message: 'Google login successful',
      accessToken: token,
      user: {
        id: user.id,
        email: userEmail,
        full_name: userFullName,
        role: user.role,
      },
    };
  }
}