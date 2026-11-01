import { ApiProperty } from "@nestjs/swagger";

export class FeatureCreditResponseDto {
  user_id: number;

  @ApiProperty({
    example: {
      'ITINERARY': 5,
      'BUDGET_PLAN': 0,
      'PACKING_LIST': 0,
      'CUSTOM_ITINERARY': 3,
      'TRIP_GUIDE': 0,
      'EMERGENCY_CONTACT':6
    },
  })
  feature_balances: Record<string, number>;
}
