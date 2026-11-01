import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewRequestDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'I believe my suspension was a mistake. Please review.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
