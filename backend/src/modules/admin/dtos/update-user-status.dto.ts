import { IsNotEmpty, IsString,IsNumber ,Length} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsNumber()
   @ApiProperty({
    required:true,
    description: 'User Id the user',
   
  })
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Length(5,100)
  @ApiProperty({ required: true, description: 'Reason for suspending/reactivating the user',
    example:'voilation of terms.'
   })
  reason: string;
}
