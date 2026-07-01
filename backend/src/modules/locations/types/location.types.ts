export enum LocationType {
  DOMESTIC = 'DOMESTIC',
  INTERNATIONAL = 'INTERNATIONAL',
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface LocationFilterOptions {
  search?: string;
  type?: LocationType;
  status?: LocationStatus;
  page?: number;
  limit?: number;
}
