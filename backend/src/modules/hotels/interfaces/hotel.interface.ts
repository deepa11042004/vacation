import { PropertyType, HotelType, HotelStatus } from '../types/hotel.types';

export interface IHotel {
  hotel_id: number;
  location_id: number;
  hotel_name: string;
  property_type: PropertyType;
  hotel_type: HotelType;
  address?: string | null;
  map_link?: string | null;
  description?: string | null;
  status: HotelStatus;
  remarks?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface IHotelImage {
  image_id: number;
  hotel_id: number;
  image_path: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
