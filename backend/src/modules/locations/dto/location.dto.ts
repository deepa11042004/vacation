import { LocationType, LocationStatus } from '../types/location.types';

export interface CreateLocationDTO {
  location_name: string;
  country: string;
  type: LocationType;
  map_link?: string | null;
  location_image?: string | null;
  description?: string | null;
  status?: LocationStatus;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateLocationDTO {
  location_name?: string;
  country?: string;
  type?: LocationType;
  map_link?: string | null;
  location_image?: string | null;
  description?: string | null;
  status?: LocationStatus;
  remarks?: string | null;
  updated_by?: number | null;
}
