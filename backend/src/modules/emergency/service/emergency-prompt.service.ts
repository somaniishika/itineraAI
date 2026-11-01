import { Injectable } from '@nestjs/common';

@Injectable()
export class EmergencyPromptService {
  generateEmergencyContactsPrompt(location: string): string {
    return `You are an emergency services information expert. Provide the most important and reliable emergency contact details for ${location}.

**Rules you must follow:**
- Provide ONLY ONE main contact for each essential service type
- Include exactly these service types: police, hospital, fire, ambulance, tourist_helpline
- Choose the most reliable, widely-used, and 24/7 available contact for each service
- Prioritize official government or main city contacts over local/regional ones
- Provide accurate, up-to-date contact information
- Include addresses where possible
- Add relevant additional information for each contact

**Response Format:**
Return the result in this exact JSON structure without any extra explanation or text:

{
  "location": "${location}",
  "emergency_contacts": [
    {
      "name": "[Primary service name (e.g., 'Goa Police Control Room')]",
      "contact": "[Phone number with country code (e.g., '+91-832-2420112')]",
      "type": "[Exactly one of: police, hospital, fire, ambulance, tourist_helpline]",
    }
  ],
  "generated_at": "[Current ISO timestamp]"
}

**Service Selection Priority:**
- **Police**: Main city/state police control room or emergency line
- **Hospital**: Largest/main government or multi-specialty hospital
- **Fire**: Main fire department control room
- **Ambulance**: Primary ambulance service (could be different from hospital)
- **Tourist Helpline**: Official tourism department helpline

**Important Notes:**
- Ensure all phone numbers include proper country codes
- Select the most reliable and widely recognized contact for each service
- Include full addresses when available
- Provide additional context like operating hours or language support
- The response must be valid JSON without any markdown formatting
- DO NOT include multiple contacts for the same service type

Generate the 5 most essential emergency contacts for ${location} now.`;
  }
}