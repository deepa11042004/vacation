import { PackageCategory, PackageStatus, UnitType } from '../types/package.types';

export interface CreatePackageDTO {
  name: string;
  category: PackageCategory;
  validity_years: number;
  total_nights: number;
  nights_per_year: number;
  unit_type: UnitType;
  max_adults?: number;
  max_children?: number;
  base_price: number;
  amc_amount: number;
  description?: string | null;
  status?: PackageStatus;
  created_by?: number | null;
}

export interface UpdatePackageDTO {
  name?: string;
  category?: PackageCategory;
  validity_years?: number;
  total_nights?: number;
  nights_per_year?: number;
  unit_type?: UnitType;
  max_adults?: number;
  max_children?: number;
  base_price?: number;
  amc_amount?: number;
  description?: string | null;
  status?: PackageStatus;
  updated_by?: number | null;
}
