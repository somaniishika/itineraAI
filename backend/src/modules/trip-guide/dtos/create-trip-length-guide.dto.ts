import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class CreateTripLengthGuideDto {
  @ApiProperty({
    example: 'Mumbai',
    description: 'The destination location for trip length recommendation'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  location: string;

}