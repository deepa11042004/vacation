export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum DSAType {
  VENUE = 'VENUE',
  CSDO = 'CSDO',
  OTHER = 'OTHER',
}

export type ClientFilterOptions = {
  search?: string;
  status?: ClientStatus;
  page?: number;
  limit?: number;
};
