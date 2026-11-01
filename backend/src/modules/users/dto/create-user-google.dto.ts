import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, MaxLength, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserGoogleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  full_name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  address?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;
}