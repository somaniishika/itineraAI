import { Injectable } from '@nestjs/common';

@Injectable()
export class ItineraryDirectiveService {
  generateItineraryPrompt(travel_location: String, country:String, trip_duration:Number, source_questions_answers: Record<string, any>): string {

   const userPreferences= Object.entries(source_questions_answers)
    .map(([question, answer], index) => {
      const formattedAnswer =
        typeof answer === 'object' ? JSON.stringify(answer, null, 2) : answer;
      return `Question${index + 1}: ${question}\nAnswer${index + 1}: ${formattedAnswer}`;
    })
    .join('\n\n');

    return `You are an expert worldwide travel itinerary planner and assistant. Based on the user's preferences listed below, create a highly personalized, day-wise travel itinerary for them for the location they have chosen.

**Rules you must follow:**
- The trip must strictly be within the selected destination(s).
- It must match the user's travel style, dietary preferences, activity interests, and restrictions.
- Avoid any activities or experiences the user dislikes.
- Adjust activities and timings to suit the number of people traveling.
- Keep the total cost per activity within their approximate budget type.
- Include hidden gems and offbeat places if requested.
- Include optional travel services if selected.
- Keep activities appropriate to the local season and weather.
- Based on the overall theme and content of the trip, include a top-level array of 3 to 5 **single-word tags** that describe the essence of the entire itinerary. These tags should be intuitive, high-level, and useful for representing the visual identity of the trip (e.g., 'beach', 'adventure', 'temples', 'food', 'culture', etc.).

**Response Format:**  
Return the result in this exact JSON structure without any extra explanation or text:

{
  "user_travel_location": "[Place or region where the user wants to travel (e.g., 'Bali')]", 
  "country_name": "[Country where this place is located (e.g., 'Indonesia')]",
  "itinerary_title": "[A descriptive, engaging title for the itinerary (e.g., '7 Days of Tropical Bliss in Bali')]",
  "tags": ["[One or more intuitive single word and relevant tags that reflect the day's theme (e.g., 'beach', 'market', 'hiking')]"],
  "days": [
    {
      "day": "[Day number as a string (e.g., '1')]",
      "day_title": "[Title for the day (e.g., 'Arrival and Beachside Relaxation')]",
      "activities": [
        {
          "time": "[Time in 24-hour format (e.g., '14:30')]",
          "title": "[Name of the activity (e.g., 'Check-in at The Legian Hotel')]",
          "description": "[A clear, detailed, engaging description of the activity (e.g., 'Check in to your beach-facing suite at The Legian, unwind with a welcome drink, and soak up sunset views from your private balcony.')]",
          "cost": "[Approximate cost for the activity in local currency and its conversion in USD (e.g., '8500-8800 INR (100 USD)'). If activity is free, write 'NA']",
          "duration": "[Estimated time for the activity (e.g., '2 hours', '45 minutes')]"
        }
      ]
    }
  ]
}
**The user wants to travel to [Place or region where the user wants to travel]: ${travel_location}**
**The country is [Country where this place is located]: ${country}**
**The number of days for the trip: [Number of days]: ${trip_duration} days**
**User Preferences [We have asked some preferences in the form of question and answer to the user, You should strictly follow these preferencesto generate the itinerary based on the user interest]:**
${userPreferences}

**Important Notes:**
- Ensure each day has a logical flow: arrival, sightseeing, meals, evening activity, and rest.
- Suggest culturally appropriate and safe activities for the selected group type.
- Respect dietary preferences (veg / non-veg / vegan, etc.) in all food recommendations.
- Provide approximate cost and duration for every activity — if an activity is free, write 'NA' in cost.
- Include famous landmarks, local markets, restaurants, and lesser-known spots if requested by the user.
- Incorporate hidden gems or offbeat places if the user asks for them.
- Keep activities suitable for the season and current weather conditions of the destination.
- If travel assistance or transport services were requested, mention them at appropriate times in the plan.
- The response format must strictly match the structure and examples provided — no variations.
- Do not add any extra headings, summaries, explanations, or recommendations beyond the JSON structure.
- Every placeholder should follow the examples provided in round brackets (e.g., …).

Generate a clean, well-structured, professional, and intuitive day-wise itinerary now.
`;
  }
}
