import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PublicOtpPurpose {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export enum OtpPurpose {
  EMAIL_CHANGE = 'EMAIL_CHANGE',
}

export class SendOtpDtoPublic {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    enum: PublicOtpPurpose,
    description: 'Purpose of the OTP',
    example: PublicOtpPurpose.VERIFY_EMAIL,
  })
  @IsEnum(PublicOtpPurpose, { message: 'purpose must be VERIFY_EMAIL or PASSWORD_RESET' })
  purpose: PublicOtpPurpose;
}

export class SendOtpDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: [OtpPurpose.EMAIL_CHANGE],
    description: 'Purpose of the OTP — only EMAIL_CHANGE allowed',
    example: OtpPurpose.EMAIL_CHANGE,
  })
  @IsEnum([OtpPurpose.EMAIL_CHANGE], { message: 'purpose must be EMAIL_CHANGE' })
  purpose: OtpPurpose.EMAIL_CHANGE;
}