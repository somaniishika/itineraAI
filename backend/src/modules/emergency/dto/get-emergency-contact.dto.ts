import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEmergencyContactsDto {
  @ApiProperty({
    description: 'Location for which to fetch or generate emergency contacts',
    example: 'India',
  })
  @IsNotEmpty()
  @IsString()
  location: string;
}