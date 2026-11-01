import {IsNotEmpty, IsString,Length, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Ishika somani' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 40)
  full_name: string;

  @ApiProperty({ example: 'Ishika_123' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;

  @ApiProperty({ example: '123,Street,Indore' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  address: string;
}
