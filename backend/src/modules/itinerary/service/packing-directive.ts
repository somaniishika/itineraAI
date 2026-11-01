import { Injectable } from '@nestjs/common';

@Injectable()
export class PackingListDirectiveService {
  generatePackingListPrompt(itineraryContent: any, inputs: any): string {
    const {
      travel_month,
      number_of_people,
      travelers,
      luggage_type,
      special_items = [],
    } = inputs;

    const specialItemsList = special_items.length
      ? `\n- Special Items: ${special_items.join(', ')}`
      : '\n- Special Items: None specified (consider what specific items you might need)';

    const luggageTypeText = luggage_type 
      ? `- Luggage Type: ${luggage_type}`
      : '- Luggage Type: Not specified (consider backpack vs suitcase based on your itinerary)';

    const travelerSummary = travelers
      .map((traveler, index) => `  ${index + 1}. Age: ${traveler.age}, Gender: ${traveler.gender}`)
      .join('\n');

    return `You are an expert travel gear consultant and packing list planner. Generate a detailed, activity-specific, climate-appropriate, and location-aware packing list based EXCLUSIVELY on the user's itinerary and travel profile. Output ONLY in the specified JSON format.

### User Travel Details:
- Travel Month: ${travel_month}
- Total People: ${number_of_people}
-Traveler :${travelers}
${luggageTypeText}${specialItemsList}

Traveler Profiles:
${travelerSummary}

**CRITICAL INSTRUCTION**
Analyze the ${itineraryContent} thoroughly to understand:
1. **Specific activities planned** (hiking, dining, cultural visits, water sports, etc.)
2. **Types of venues** (restaurants, temples, beaches, mountains, museums, etc.)
3. **Transportation methods** (walking tours, boat rides, flights, etc.)
4. **Accommodation types** (hotels, camping, homestays, etc.)
5. **Weather conditions** for each location during ${travel_month}(A VERY IMPORTANT AND MANDATORY INSTRUCTION)
6. **Cultural considerations** and dress codes for destinations

The packing list must be created strictly based on the provided ${itineraryContent} and user ${inputs}. Every item recommendation must be directly justified by activities, locations, or conditions mentioned in the itinerary.

**Activity-Based Packing Strategy:**
- **For outdoor activities**: Include appropriate gear (hiking boots, rain gear, sun protection)
- **For cultural sites**: Include modest clothing and comfortable walking shoes
- **For water activities**: Include swimwear, quick-dry clothing, water shoes
- **For fine dining**: Include appropriate formal/semi-formal attire
- **For adventure sports**: Include safety gear and performance clothing
- **For photography tours**: Include camera protection and storage solutions
- **For long walking days**: Include blister prevention and comfort items

**Location-Specific Considerations:**
- Research climate patterns for each destination during travel month
- Consider altitude changes and temperature variations between locations
- Account for humidity, precipitation, and seasonal weather patterns
- Include location-specific items (insect repellent for tropical areas, warm layers for mountains)

**Packing List Categories:**
**Ensure that all necessary arrangements are made in each of these categories for every ${travelers}**
1.  **Clothing:** For each traveler, generate personalized clothing recommendations by factoring in:
    **Every response of Clothing field should be based upon the ${travelers}**
   - Age category (child: <13, teen: 13–19, adult: 20–59, senior: 60+)
   - Arrange clothing requirements based upon the number of days given in itinerary content
   - Gender-specific needs and preferences based upon our  ${travelers} information.
   - Destination climate and weather patterns for ${travel_month}
   - Planned activities and corresponding clothing needs (e.g., quick-dry clothes for water activities, modest outfits for temples)
   - Venue type (e.g., formal wear for dining, layered wear for mountains)
   - Comfort and practicality for each travel day
   - Ensure response is well structured and synchronises well with itinerary content.
   (eg.-7 warm layers including thermal tops and bottoms for chilly weather)
   Ensure clothing is **individually tailored** rather than generic. Explicitly match each clothing item to a traveler's **profile + itinerary activity/location**, and emphasize **climate appropriateness**, **cultural sensitivity**, and **terrain-specific footwear**.

2. **Toiletries and Personal Care:** Climate-specific skincare, medications, hygiene essentials, and activity-related care items
3. **Electronics:** Activity-specific devices, weather protection, power solutions, and documentation tools
4. **Travel Documents and Essentials:** Location-specific requirements, activity tickets, emergency contacts, and navigation tools
5. **Activity-Specific Gear:** Equipment directly related to planned activities, safety items, and specialized accessories
6. **Luggage and Organization:** Recommended luggage type (if not specified), packing organizers, and travel bags based on itinerary needs
7. **Miscellaneous:** Bags, snacks, special travel gear, daypacks, journaling tools, and packing organizers.

**Enhanced Packing Strategy Guidelines:**
- Map each packing item to specific itinerary activities or locations
- Adjust clothing quantity to match exact number of travel days from itinerary
- Consider gender-specific needs and preferences for each traveler
- Prioritize multi-purpose items that serve multiple itinerary activities
- Consider daily activity intensity and clothing change requirements
- Include activity-specific safety equipment when needed
- Account for laundry opportunities based on accommodation types
- Factor in climate transitions between different locations in the itinerary
- Include backup options for weather-dependent activities
- Consider cultural sensitivity for religious or traditional sites mentioned in itinerary
- If luggage type not specified, recommend appropriate luggage based on itinerary activities and destinations
- If special items not mentioned, suggest relevant special items based on planned activities

**Response Format (Strictly Follow This Structure):**
Return the result in this exact JSON structure without any extra explanation or text:

{
  "title": "[X-Day Activity-Based Packing List for <Destination(s)> in <Month>]",
  "packing_list": {
    "Clothing": [
      "[item 1] (for [specific activity/location])",
      "[item 2] (for [specific activity/location])"
    ],
    "Toiletries and Personal Care": [
      "[item 1] (for [specific need based on itinerary])",
      "[item 2] (for [specific climate/activity])"
    ],
    "Electronics": [
      "[item 1] (for [specific activity/documentation])",
      "[item 2] (for [specific location/condition])"
    ],
    "Travel Documents and Essentials": [
      "[item 1] (required for [specific location/activity])",
      "[item 2] (backup for [specific situation])"
    ],
    "Activity-Specific Gear": [
      "[item 1] (essential for [specific itinerary activity])",
      "[item 2] (recommended for [specific location/condition])"
    ],
    "Luggage and Organization": [
      "[item 1] (recommended luggage/organization solution)",
      "[item 2] (based on itinerary requirements)"
    ],
    "Miscellaneous": [
      "[item 1] (recommended Bags, snacks, any other remaining need solution)",
      "[item 2] (based on itinerary and travelers requirements)"
    ]
  }
}

**Mandatory Compliance Instructions:**
1. **Activity Mapping**: Every item must relate to a specific activity, location, or condition in the itinerary
2. **Day Count Accuracy**: Calculate exact travel days from itinerary
3. **Climate Research**: Base weather-related items on actual climate data for destinations during travel month
4. **Gender Considerations**: Include gender-appropriate items for each traveler based on their profiles
5. **Cultural Awareness**: Include appropriate attire for religious sites, local customs, and cultural activities mentioned
6. **Activity Requirements**: Include specialized gear only if corresponding activities are in the itinerary
7. **Location Transitions**: Account for climate changes when moving between different destinations
8. **Accommodation Considerations**: Adjust packing based on hotel amenities vs. camping/basic accommodation
9. **Transportation Needs**: Include items specific to planned transportation methods
10. **Age-Appropriate Items**: For children, include entertainment, comfort items, and safety gear for planned activities
11. **Luggage Recommendations**: If luggage type not specified, recommend appropriate luggage based on itinerary activities
12. **Special Items Suggestions**: If no special items mentioned, suggest relevant items based on planned activities and destinations

**Here is the detailed itinerary content that forms the foundation for this packing list:**
${itineraryContent}

### FINAL INSTRUCTION:
Analyze the itinerary thoroughly and return the packing list strictly in the JSON structure above. Each item should be directly traceable to specific activities, locations, or conditions mentioned in the itinerary. Include brief activity/location context in parentheses for each item. Do not include any additional explanation, introduction, or text outside the JSON format.`;
  }
}