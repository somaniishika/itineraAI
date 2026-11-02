export type ItineraryQuestion = {
  id: number;
  question_text: string;
  field_type: 'text' | 'dropdown' | 'multi-select' | 'date' | string;
  options?: string[] | null;
  image_url?: string | null;
  answer?: string | string[] | null;
};

export type ItineraryListItem = {
  itinerary_id: number;
  travel_location: string;
  country: string;
  title?: string | null;
  type?: string;
  created_at?: string;
};

export type ItineraryListResponse = {
  data: ItineraryListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateItineraryRequest = {
  travel_location: string;
  country: string;
  trip_duration: number;
  source_questions_answers: Record<string, string | string[]>;
};

export type ItineraryActivity = {
  time?: string;
  title?: string;
  description?: string;
  duration?: string;
  cost?: string;
};

export type ItineraryDay = {
  day?: string | number;
  day_title?: string;
  tags?: string[];
  activities?: ItineraryActivity[];
};

export type ItineraryContent = {
  itinerary_title?: string;
  user_travel_location?: string;
  country_name?: string;
  description?: string;
  tags?: string[];
  days?: ItineraryDay[];
  [key: string]: unknown;
};

export type ItineraryRecord = {
  id: number;
  travel_location: string;
  country: string;
  type?: string;
  created_at?: string;
  content: ItineraryContent;
};