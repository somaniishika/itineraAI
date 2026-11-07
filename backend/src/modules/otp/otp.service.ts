import { Injectable, Logger, BadRequestException, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { OtpRepository } from './repositories/otp.repository';
import { CreateOtpDto } from './dto/create-otp.dto';
import { generateSixDigitOtp } from './utils/otp-generator';
import { SendGridService } from '../provider/sendgrid/sendgrid.service';
import { otpEmailVerificationTemplate } from '../provider/sendgrid/templates/welcome-email-verify-otp.template';
import { OtpServiceMessages } from './constant/otp.service.message';
import { otpPasswordResetTemplate } from '../provider/sendgrid/templates/forgot-passoword.template';
import { otpEmailChangeTemplate } from '../provider/sendgrid/templates/email-change.template';
import { UserRepository } from '../users/repositories/users.repository';
import { VerifyOtpOpenDto } from './dto/verify-otp-open.dto';
import { hashPassword } from 'src/modules/auth/utils/auth.utils';
import { FeatureManagementService } from '../feature-management/feature-management.service';
import { VerifyOtpAuthDto } from './dto/verify-otp-auth-dto';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly sendGridService: SendGridService,
    private readonly userRepository: UserRepository,
    private readonly featureManagementService: FeatureManagementService,
  ) { }

  async handleOtpRequest(userId: number | null, email: string, purpose: 'VERIFY_EMAIL' | 'PASSWORD_RESET' | 'EMAIL_CHANGE') {
    let user;

    if (purpose === 'EMAIL_CHANGE') {

      console.log('Authenticated user ID:', userId);
      user = await this.userRepository.findById(userId!);
      if (!user) {
        this.logger.warn(`Attempt to change email by non-existent user ID: ${userId}`);
        throw new Error(OtpServiceMessages.USER_NOT_FOUND);
      }

      // Check if the new email is already taken by another user
      const existingEmailUser = await this.userRepository.findByEmail(email);
      if (existingEmailUser) {
        this.logger.warn(`Attempt to change to an already existing email: ${email}`);
        throw new Error(OtpServiceMessages.EMAIL_IN_USE);
      }

      // If its available, proceed to send OTP to the new email
    } else {
      user = await this.userRepository.findByEmail(email);
      if (!user) {
        this.logger.warn(`Attempt to send OTP to non-existent email: ${email}`);
        throw new Error(OtpServiceMessages.USER_NOT_FOUND);
      }

      if (purpose === 'VERIFY_EMAIL' && user.email_verified) {
        this.logger.log(`Email ${email} is already verified.`);
        throw new Error(OtpServiceMessages.EMAIL_ALREADY_VERIFIED);
      }

    }

    const otpRecipientEmail = purpose === 'EMAIL_CHANGE' ? email : user.email;
    const userFullName = user.full_name;

    return this.sendOtp(user.id, purpose, otpRecipientEmail, userFullName);
  }

  async sendOtp(
    userId: number,
    purpose: 'VERIFY_EMAIL' | 'PASSWORD_RESET' | 'EMAIL_CHANGE',
    userEmail: string,
    userFullName: string,
  ) {
    try {
      const existingOtp = await this.otpRepository.findOtpByUserAndPurpose(userId, purpose);
      const otpCode = generateSixDigitOtp();

      this.logger.log(`Generated OTP for user ${userId}: ${otpCode}`);

      if (existingOtp) {
        if (existingOtp.otp_limit <= 0) {
          this.logger.warn(`OTP limit exhausted for user ${userId} and purpose ${purpose}`);
          throw new Error(OtpServiceMessages.OTP_LIMIT_EXHAUSTED);
        }

        existingOtp.otp_code = otpCode;
        existingOtp.otp_limit -= 1;
        await this.otpRepository.save(existingOtp);
      } else {
        const createOtpDto: CreateOtpDto = {
          user_id: userId,
          otp_code: otpCode,
          purpose,
        };
        await this.otpRepository.createOtp(createOtpDto);
      }

      const { subject, text, html } = this.getOtpTemplate(purpose, userFullName, userEmail, otpCode);

      await this.sendGridService.sendEmail({ to: userEmail, subject, text, html });

      this.logger.log(`OTP sent for user ${userId} for purpose ${purpose} and otp code ${otpCode}`);
      return { otpSent: true };
    } catch (error) {
      this.logger.error(`Failed to send OTP for user ${userId}`, error.stack);
      throw error;
    }
  }

  private getOtpTemplate(
    purpose: 'VERIFY_EMAIL' | 'PASSWORD_RESET' | 'EMAIL_CHANGE',
    userFullName: string,
    userEmail: string,
    otpCode: string,
  ) {
    switch (purpose) {
      case 'VERIFY_EMAIL':
        return otpEmailVerificationTemplate(userFullName, otpCode);
      case 'PASSWORD_RESET':
        return otpPasswordResetTemplate(userFullName, otpCode);
      case 'EMAIL_CHANGE':
        return otpEmailChangeTemplate(userFullName, userEmail, otpCode);
      default:
        throw new Error(OtpServiceMessages.UNSUPPORTED_PURPOSE);
    }
  }

  async getLatestOtpForUser(userId: number, purpose: string) {
    return await this.otpRepository.findOtpByUserAndPurpose(userId, purpose);
  }


  async verifyOtpOpen(dto: VerifyOtpOpenDto) {
    const { email, otp, purpose, newPassword } = dto;

    // Fetch user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`OTP verification failed. User with email ${email} not found.`);
      throw new Error(OtpServiceMessages.USER_NOT_FOUND);
    }


    // Fetch OTP
    const otpRecord = await this.otpRepository.findOtpByUserAndPurpose(user.id, purpose);
    if (!otpRecord || otpRecord.otp_code !== otp) {
      this.logger.warn(`Invalid OTP for ${email}, purpose: ${purpose}`);
      throw new Error(OtpServiceMessages.INVALID_OR_EXPIRED_OTP);
    }

    // check for expiration
    const now = new Date();
    const otpUpdatedAt = new Date(otpRecord.updated_at); 
    // console.log(`OTP updated at: ${otpUpdatedAt}, Current time: ${now}`);

    const minutesSinceUpdate = differenceInMinutes(now, otpUpdatedAt);
    // console.log(`Minutes since OTP update: ${minutesSinceUpdate}`);
  
    if (minutesSinceUpdate > 10 + 330) { // 10 minutes + 5.5 hours for IST
      this.logger.warn(`OTP for ${email} expired. It was generated ${minutesSinceUpdate} minutes ago.`);
      throw new Error(OtpServiceMessages.INVALID_OR_EXPIRED_OTP);
    }
  
    // Switch by purpose
    switch (purpose) {
      case 'VERIFY_EMAIL':
        user.email_verified = true;
        await this.userRepository.save(user);
        await this.featureManagementService.creditFeatureToUser(
          user.id,
          'EMERGENCY_CONTACT',
          OtpServiceMessages.FREE_EMERGENCY_CREDITS,
        );
        this.logger.log(`User ${email} verified successfully.`);
        break;

      case 'PASSWORD_RESET':
        if (!newPassword) {
          throw new Error(OtpServiceMessages.NEW_PASSWORD_REQUIRED);
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password_hash = hashedPassword;
        await this.userRepository.save(user);
        this.logger.log(`Password reset successful for ${email}`);
        break;

      default:
        this.logger.error(`Unsupported purpose: ${purpose}`);
        throw new Error(OtpServiceMessages.UNSUPPORTED_PURPOSE);
    }

    // Delete the OTP after use
    await this.otpRepository.delete(otpRecord.id);

    return { message: 'OTP verified and action completed successfully' };
  }

  async verifyOtpAuth(userId: number, dto: VerifyOtpAuthDto) {
  const { newEmail, otp } = dto;

  const user = await this.userRepository.findById(userId);
  if (!user) {
    this.logger.warn(`Email change failed. User with ID ${userId} not found.`);
    throw new Error(OtpServiceMessages.USER_NOT_FOUND);
  }

  const otpRecord = await this.otpRepository.findOtpByUserAndPurpose(user.id, 'EMAIL_CHANGE');
  if (!otpRecord || otpRecord.otp_code !== otp) {
    this.logger.warn(`Invalid OTP for email change for user ID ${userId}`);
    throw new Error(OtpServiceMessages.INVALID_OR_EXPIRED_OTP);
  }

  const existingUser = await this.userRepository.findByEmail(newEmail);
  if (existingUser) {
    this.logger.warn(`Email change failed. Email ${newEmail} is already in use.`);
    throw new Error(OtpServiceMessages.EMAIL_IN_USE);
  }

  user.email = newEmail;
  user.email_verified = true;
  await this.userRepository.save(user);

  await this.otpRepository.delete(otpRecord.id);

  this.logger.log(`User ID ${userId} changed their email to ${newEmail} successfully.`);

  return { success:'true',message: 'Email updated successfully' };
}
}  