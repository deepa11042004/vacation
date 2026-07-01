import { PropertyType, HotelType, HotelStatus } from '../types/hotel.types';

export interface CreateHotelDTO {
  location_id: number;
  hotel_name: string;
  property_type: PropertyType;
  hotel_type: HotelType;
  address?: string | null;
  map_link?: string | null;
  description?: string | null;
  status?: HotelStatus;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateHotelDTO {
  location_id?: number;
  hotel_name?: string;
  property_type?: PropertyType;
  hotel_type?: HotelType;
  address?: string | null;
  map_link?: string | null;
  description?: string | null;
  status?: HotelStatus;
  remarks?: string | null;
  updated_by?: number | null;
}

export interface AddHotelImageDTO {
  image_path: string;
  sort_order?: number;
}
