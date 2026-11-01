import { Injectable } from '@nestjs/common';

export interface CustomItineraryRequest {
  travel_location?: string;
  country?: string;
  trip_duration?: number;
  preferences?: string[];
  travel_type?: string; 
  day_wise_customizations?: DayCustomization[];
  general_customizations?: string;
  remove_validations?: boolean;
}

export interface DayCustomization {
  day: number;
  general_instructions?: string;
}

@Injectable()
export class CustomDirectiveService {
  generateCustomItineraryPrompt(originalItinerary: string, updatedRequest: CustomItineraryRequest): string {
    const dayWiseInstructions = this.generateDayWiseInstructions(updatedRequest.day_wise_customizations);
    const generalCustomizations = updatedRequest.general_customizations || '';
    const requirements = this.buildRequirementsSection(updatedRequest);
  
    return `You are a professional travel itinerary customization expert. Your task is to STRICTLY MODIFY the original itinerary based on the user's request.
  
  ALL REQUESTS BELOW MUST BE APPLIED — NO EXCEPTIONS.
  
  ---
  
  **ORIGINAL ITINERARY TO CUSTOMIZE:**
  ${originalItinerary}
  
  ---
  
  ${requirements ? `${requirements}\n` : ''}
  
  ${generalCustomizations ? `**GENERAL CUSTOMIZATION REQUESTS (MANDATORY):**\n${generalCustomizations}\n` : ''}
  
  ${dayWiseInstructions ? `${dayWiseInstructions}\n` : ''}
  
  ---
  
  **MANDATORY CUSTOMIZATION STRATEGY:**
  
  1. **ENFORCE USER REQUESTS**
     - All general and day-wise customizations must be reflected.
     - If there’s a conflict between the original and user’s request, prioritize the user.

  2. **APPLY EVERY REQUEST WITHOUT EXCEPTION**
   - Each general and day-wise request must be reflected.
   - Even if a request seems minor or ambiguous, it MUST be incorporated meaningfully.
   - Prioritize user instructions over existing itinerary content.
  
  3. **PRESERVE JSON STRUCTURE**
     - Output must keep the same JSON structure and field names.
     - Allowed to modify activity content but not structural keys.
  
  4. **SMART ACTIVITY HANDLING**
     - ADD: Insert new user-requested activities.
     - REMOVE: Omit any user-specified activities.
     - REPLACE: Modify or swap based on user inputs.
     - Keep everything realistic and logically timed.
  
  5. **HANDLE AMBIGUITY GRACEFULLY**
     - Use best judgment for vague instructions.
     - Prioritize feasibility, comfort, and engagement.
  
  6. **STRICT FORMAT COMPLIANCE**
     - No commentary or explanation outside the JSON.
     - Maintain logical flow, time accuracy, and completeness.
  
  ---
  
  **OUTPUT FORMAT:**
  Return ONLY the fully updated JSON itinerary do not include extra explanations or comments . It should:
  - Retain original keys: \`user_travel_location\`, \`country_name\`, \`itinerary_title\`, \`days\`, \`description\`
  - Within \`days[]\`, each item must include: \`day\`, \`day_title\`, \`activities[]\`
  - Each activity must have: \`time\`, \`title\`, \`description\`, \`cost\`, \`duration\`
  
  
  ---
  
  **CRITICAL INSTRUCTIONS:**
  -  Do NOT include extra explanations or comments
  -  DO apply every user request exactly
  -  DO maintain JSON formatting strictly
  -  DO ensure edits are logical, enjoyable, and clear
  
  Begin now. Return ONLY the updated JSON itinerary.`;
  }
  

  private buildRequirementsSection(request: CustomItineraryRequest): string {
    const requirements: string[] = [];
    if (request.travel_location) requirements.push(`- Location: ${request.travel_location}${request.country ? `, ${request.country}` : ''}`);
    if (request.trip_duration) requirements.push(`- Duration: ${request.trip_duration} days`);
    if (request.preferences && request.preferences.length > 0) {
      requirements.push(`- Preferences: ${request.preferences.join(', ')}`);
    }
    return requirements.length > 0 ? `**UPDATED REQUIREMENTS:**\n${requirements.join('\n')}` : '';
  }

  private generateDayWiseInstructions(dayCustomizations?: DayCustomization[]): string {
    if (!dayCustomizations || dayCustomizations.length === 0) return '';
    return `\n**DAY-SPECIFIC CUSTOMIZATIONS:**\n${dayCustomizations.map(day => {
      let instructions = `\n**Day ${day.day} Changes:**`;
      if (day.general_instructions) instructions += `\n• GENERAL REQUEST: ${day.general_instructions}`;
      return instructions;
    }).join('\n')}`;
  }

  validateCustomizationRequest(request: CustomItineraryRequest): { isValid: boolean; errors: string[] } {
    if (request.remove_validations) return { isValid: true, errors: [] };
    const errors = [] as string[];
    if (request.travel_location !== undefined && !request.travel_location?.trim()) {
      errors.push('Travel location cannot be empty if provided');
    }
    if (request.country !== undefined && !request.country?.trim()) {
      errors.push('Country cannot be empty if provided');
    }
    if (request.trip_duration !== undefined && request.trip_duration < 1) {
      errors.push('Trip duration must be at least 1 day if provided');
    }
    if (request.day_wise_customizations && request.trip_duration) {
      request.day_wise_customizations.forEach((dayCustom, index) => {
        if (dayCustom.day < 1 || dayCustom.day > request.trip_duration!) {
          errors.push(`Day ${index + 1} customization has invalid day number (${dayCustom.day})`);
        }
      });
    }
    return { isValid: errors.length === 0, errors };
  }

  generateModificationSummary(request: CustomItineraryRequest): any {
    return {
      preferences_updated: request.preferences?.length || 0,
      day_wise_changes: request.day_wise_customizations?.length || null,
    };
  }
}
