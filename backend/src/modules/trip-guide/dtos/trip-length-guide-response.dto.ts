import { ApiProperty } from "@nestjs/swagger";
export class TripLengthGuideResponseDto {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    location: string;
  
    @ApiProperty()
    content: Record<string, any>;
  
    @ApiProperty()
    created_at: Date;
  }