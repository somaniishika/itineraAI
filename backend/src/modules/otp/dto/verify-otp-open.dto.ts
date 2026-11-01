import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class VerifyOtpOpenDto {
  @ApiProperty({
    description: 'Email address associated with the OTP request',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The OTP code sent to the email',
    example: '859421',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'Purpose of the OTP verification',
    example: 'VERIFY_EMAIL',
    enum: ['VERIFY_EMAIL', 'PASSWORD_RESET'],
  })
  @IsEnum(['VERIFY_EMAIL', 'PASSWORD_RESET'])
  purpose: 'VERIFY_EMAIL' | 'PASSWORD_RESET';

  @ApiPropertyOptional({
    description: 'New password to be set in case of password reset. Must be at least 6 characters.',
    example: 'newSecureP@ssw0rd',
  })
  @IsOptional()
  @MinLength(6)
  newPassword?: string;
}
