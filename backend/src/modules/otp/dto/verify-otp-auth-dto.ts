import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpAuthDto {
  @ApiProperty({
    description: 'New email address to be verified and updated',
    example: 'newemail@example.com',
  })
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    description: 'OTP code sent to the new email address',
    example: '748292',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
