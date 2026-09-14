export enum ItineraryType {
  DOMESTIC = 'DOMESTIC',
  INTERNATIONAL = 'INTERNATIONAL',
}

export enum ItineraryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface ItineraryScheduleItem {
  day: string;
  title: string;
  desc: string;
}

export interface ItineraryFilterOptions {
  search?: string;
  type?: ItineraryType;
  status?: ItineraryStatus;
  category?: string;
  page?: number;
  limit?: number;
  deleted?: boolean;
  includeDeleted?: boolean;
  sort?: 'name' | 'created_at';
}
