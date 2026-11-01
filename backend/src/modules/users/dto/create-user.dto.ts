import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, MaxLength, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'Bob Men' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  full_name: string;

  @ApiPropertyOptional({ example: 'bobmen101' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  username?: string;

  @ApiProperty({ example: 'wayventures@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @ApiPropertyOptional({ example: '@dVenture123' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiPropertyOptional({ example: '221B Baker Street, London' })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  address?: string;

}
