export enum PackageCategory {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum UnitType {
  STUDIO = 'STUDIO',
  ONE_BHK = '1BHK',
  TWO_BHK = '2BHK',
  SUITE = 'SUITE',
}

export enum PackageStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type PackageFilterOptions = {
  search?: string;
  category?: PackageCategory;
  status?: PackageStatus;
  page?: number;
  limit?: number;
};
