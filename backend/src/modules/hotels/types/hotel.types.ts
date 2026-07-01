export enum PropertyType {
  INTERNAL_PROPERTY = 'INTERNAL_PROPERTY',
  ASSOCIATED_PROPERTY = 'ASSOCIATED_PROPERTY',
}

export enum HotelType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  VILLA = 'VILLA',
  APARTMENT = 'APARTMENT',
  HOMESTAY = 'HOMESTAY',
  GUEST_HOUSE = 'GUEST_HOUSE',
}

export enum HotelStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface HotelFilterOptions {
  search?: string;
  location_id?: number;
  property_type?: PropertyType;
  hotel_type?: HotelType;
  status?: HotelStatus;
  page?: number;
  limit?: number;
}
