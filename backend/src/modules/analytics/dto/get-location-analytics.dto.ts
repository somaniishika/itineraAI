import { ApiProperty } from '@nestjs/swagger';

export class LocationAnalyticsItemDto {
  @ApiProperty({ example: 'India', description: 'Country name' })
  country: string;

  @ApiProperty({ example: 45, description: 'Total itineraries for this country' })
  count: number;

  @ApiProperty({ example: 12.5, description: 'Percentage share of this country compared to total itineraries' })
  percentage: number;

  @ApiProperty({ example: 1, description: 'Rank of the country based on itinerary count' })
  rank: number;
}

export class LocationAnalyticsResponseDto {
  @ApiProperty({ example: 2, description: 'Total number of unique countries' })
  totalCountries: number;

  @ApiProperty({ example: 13, description: 'Total number of itineraries overall' })
  totalItineraries: number;

  @ApiProperty({ type: [LocationAnalyticsItemDto], description: 'Detailed analytics per country' })
  data: LocationAnalyticsItemDto[];
}
