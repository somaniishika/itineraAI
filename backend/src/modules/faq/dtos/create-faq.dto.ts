
import { IsNotEmpty, IsString, MinLength, Length} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({
    description: 'The question to be answered',
    example: 'Can I customize my itinerary??',
  })
  @IsNotEmpty({ message: 'Question cannot be empty' })
  @IsString({ message: 'Question must be a string' })
  @Length(10, 500,{ message: 'Question must be at least 10 characters long and can not be longer than 500 characters.'})
  question: string;

  @ApiProperty({
    description: 'The answer to the question',
    example: 'Absolutely! You can add or remove destinations, change activities, and adjust travel times.',
  })
  @IsNotEmpty({ message: 'Answer cannot be empty' })
  @IsString({ message: 'Answer must be a string' })
  @Length(10, 2000,{ message: 'Answer must be at least 10 characters long and can not be longer than 2000 characters.' })
  answer: string;

  @ApiProperty({
    description: 'Category for the FAQ',
    example: 'Features'
  })
  @IsNotEmpty({ message: 'Category cannot be empty' })
  @IsString({ message: 'Category must be a string' })
  @Length(5, 25,{ message: 'Category must be at least 5 characters long and can not be longer than 25 characters.' })
  category: string;
}