import { LocationType, LocationStatus } from '../types/location.types';

export interface CreateLocationDTO {
  location_code: string;
  location_name: string;
  country: string;
  type: LocationType;
  map_link?: string | null;
  location_image?: string | null;
  description?: string | null;
  famous_sightseens?: string[] | null;
  is_online?: boolean;
  status?: LocationStatus;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateLocationDTO {
  location_code?: string;
  location_name?: string;
  country?: string;
  type?: LocationType;
  map_link?: string | null;
  location_image?: string | null;
  description?: string | null;
  famous_sightseens?: string[] | null;
  is_online?: boolean;
  status?: LocationStatus;
  remarks?: string | null;
  updated_by?: number | null;
}
