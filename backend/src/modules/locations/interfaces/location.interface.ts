import { LocationType, LocationStatus } from '../types/location.types';

export interface ILocation {
  location_id: number;
  location_name: string;
  country: string;
  type: LocationType;
  map_link?: string | null;
  location_image?: string | null;
  description?: string | null;
  status: LocationStatus;
  remarks?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
