import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {

  @ApiProperty({
    description: 'Password used to confirm account deletion',
    minLength: 6,
    example: 'yourPassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}