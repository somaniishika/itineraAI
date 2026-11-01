export interface EmergencyContactData {
  name: string;
  contact: string;
  type: 'police' | 'hospital' | 'fire' | 'ambulance' | 'tourist_helpline' ;
  address?: string;
  additional_info?: string;
}

export interface EmergencyAIResponseDto {
  location: string;
  emergency_contacts: EmergencyContactData[];
  generated_at: string;
}
