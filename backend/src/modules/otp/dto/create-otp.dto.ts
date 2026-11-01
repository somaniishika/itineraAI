import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @IsEnum(['VERIFY_EMAIL', 'PASSWORD_RESET', 'EMAIL_CHANGE'])
  purpose: 'VERIFY_EMAIL' | 'PASSWORD_RESET' | 'EMAIL_CHANGE';

  otp_limit?: number; // optional, defaults handled in entity
}
