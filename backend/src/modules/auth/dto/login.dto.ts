import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email address or username of the user',
    example: 'bobmen100@example.com',
  })
  emailOrUsername: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password for the user',
    example: 'xbcbsbsuA@123!',
  })
  password: string;
}
