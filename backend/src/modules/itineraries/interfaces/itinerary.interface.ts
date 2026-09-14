import { ItineraryType, ItineraryStatus, ItineraryScheduleItem } from '../types/itinerary.types';

export interface IItinerary {
  itinerary_id: number;
  slug: string;
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
  status: ItineraryStatus;
  remarks?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface IItineraryImage {
  image_id: number;
  itinerary_id: number;
  image_path: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
