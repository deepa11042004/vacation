import { PackageRepository } from '../repositories/package.repository';
import { CreatePackageDTO, UpdatePackageDTO } from '../dto/package.dto';
import { PackageFilterOptions } from '../types/package.types';
import { PACKAGE_CONSTANTS } from '../constants/package.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';

export class PackageService {
  private packageRepository: PackageRepository;

  constructor() {
    this.packageRepository = new PackageRepository();
  }

  async createPackage(data: CreatePackageDTO) {
    const existing = await this.packageRepository.findByNameAndCategory(data.name, data.category);
    if (existing) {
      throw new AppError(PACKAGE_CONSTANTS.ERRORS.NAME_EXISTS, 400);
    }

    const newPackage = await this.packageRepository.create(data);
    return newPackage.toJSON();
  }

  async getPackageById(package_id: number) {
    const pkg = await this.packageRepository.findById(package_id);
    if (!pkg) {
      throw new AppError(PACKAGE_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return pkg.toJSON();
  }

  async getAllPackages(filters: PackageFilterOptions) {
    const { rows, count } = await this.packageRepository.findAll(filters);
    const packages = rows.map((pkg) => pkg.toJSON());

    return {
      packages,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  // Returns all active packages grouped by category — useful for frontend listing
  async getPackagesGroupedByCategory() {
    const { rows } = await this.packageRepository.findAll({ status: undefined, page: 1, limit: 100 });
    const grouped: Record<string, any[]> = { SILVER: [], GOLD: [], PLATINUM: [] };
    for (const pkg of rows) {
      const json = pkg.toJSON();
      if (grouped[json.category]) {
        grouped[json.category].push(json);
      }
    }
    return grouped;
  }

  async updatePackage(package_id: number, data: UpdatePackageDTO) {
    const pkg = await this.packageRepository.findById(package_id);
    if (!pkg) {
      throw new AppError(PACKAGE_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (data.name || data.category) {
      const checkName = data.name ?? pkg.name;
      const checkCategory = data.category ?? pkg.category;
      const existing = await this.packageRepository.findByNameAndCategory(checkName, checkCategory);
      if (existing && existing.package_id !== package_id) {
        throw new AppError(PACKAGE_CONSTANTS.ERRORS.NAME_EXISTS, 400);
      }
    }

    await this.packageRepository.update(package_id, data);
    return this.getPackageById(package_id);
  }

  async softDeletePackage(package_id: number) {
    const pkg = await this.packageRepository.findById(package_id);
    if (!pkg) {
      throw new AppError(PACKAGE_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    await this.packageRepository.delete(package_id);
  }

  async restorePackage(package_id: number) {
    const pkg = await this.packageRepository.findByIdWithDeleted(package_id);
    if (!pkg) {
      throw new AppError(PACKAGE_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (!pkg.deleted_at) {
      throw new AppError('Package is not deleted', 400);
    }
    await this.packageRepository.restore(package_id);
  }
}
