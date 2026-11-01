import { IsObject, IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItineraryDto {
  @ApiProperty({
    example: 'Andaman and Nicobar Islands',
    description: 'The main city or location the user wants to travel to',
  })
  @IsString()
  @IsNotEmpty()
  travel_location: string;

  @ApiProperty({
    example: 'India',
    description: 'Country of the travel destination',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: 10,
    description: 'Duration of the trip in days (must be between 1 and 10)',
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Trip duration must be at least 1 day' })
  @Max(10, { message: 'Trip duration cannot exceed 10 days' })
  trip_duration: number;

  @ApiProperty({
    description: 'Object containing questions and the user’s responses for personalized itinerary generation',
    example: {
        "What type of traveler are you?": 'Nature Lover, Adventure Seeker, Culture Enthusiast, Relaxation & Wellness Traveler, Food Explorer',
        "What is your preferred accommodation type?": 'Hostel, Budget Hotel, 3–4 Star Hotel, 5-Star Resort, Luxury Stay, Villa',
        "Any dietary preferences we should consider?": 'Vegetarian, Vegan, Non-Vegetarian, Gluten-Free, Jain, No preference',
        "Which types of activities would you like to include in your trip?": 'Wildlife & Nature Parks, Trekking/Hiking, Historical Monuments & Culture, Beach & Water Activities, Food & Culinary Experiences, Spa & Wellness, Local Markets & Shopping, Adventure Sports (e.g., rafting, paragliding)',
        "How would you like your daily itinerary pace to be?": 'Relaxed (3–4 activities per day), Balanced (4–5 activities per day), Packed (6 activities per day)',
        "Do you have a preferred mode of local transport?": 'Private Car, Self-drive Rental, Public Transport, Bicycle, No Preference',
        "Any specific dates for your travel?": '2025-11-15',
        "Mention any special interests, needs, or restrictions you'd like us to know about?": 'Want to explore offbeat hill stations and Ayurvedic spas',
        "Are there any activities you want to avoid?": 'Nightlife/Clubs, Crowded Places, Long Travel Hours, Adventure Sports, None',
        "Would you like to include nearby hidden gems or offbeat places?": 'Yes, I love exploring hidden spots, No, prefer popular attractions'
    }
  })
  @IsObject()
  source_questions_answers: Record<string, any>;
}
