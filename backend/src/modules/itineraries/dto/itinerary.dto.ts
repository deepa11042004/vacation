import { ItineraryType, ItineraryStatus, ItineraryScheduleItem } from '../types/itinerary.types';

export interface CreateItineraryDTO {
  slug?: string;
  name: string;
  destination: string;
  type: ItineraryType;
  category?: string | null;
  badge?: string | null;
  duration?: string | null;
  days: number;
  nights: number;
  best_time?: string | null;
  image?: string | null;
  short_desc?: string | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  schedule?: ItineraryScheduleItem[] | null;
  status?: ItineraryStatus;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateItineraryDTO {
  slug?: string;
  name?: string;
  destination?: string;
  type?: ItineraryType;
  category?: string | null;
  badge?: string | null;
  duration?: string | null;
  days?: number;
  nights?: number;
  best_time?: string | null;
  image?: string | null;
  short_desc?: string | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  schedule?: ItineraryScheduleItem[] | null;
  status?: ItineraryStatus;
  remarks?: string | null;
  updated_by?: number | null;
}

export interface AddItineraryImageDTO {
  image_path: string;
  sort_order?: number;
}
