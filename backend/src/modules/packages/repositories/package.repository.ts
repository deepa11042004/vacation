import { Op, Transaction } from 'sequelize';
import { Package } from '../models/Package.model';
import { UpdatePackageDTO } from '../dto/package.dto';
import { PackageFilterOptions, PackageCategory } from '../types/package.types';
import { IPackage } from '../interfaces/package.interface';

const MAX_LIMIT = 100;

export class PackageRepository {
  async create(data: Partial<IPackage>, transaction?: Transaction): Promise<Package> {
    return await Package.create(data, { transaction });
  }

  async findById(package_id: number): Promise<Package | null> {
    return await Package.findByPk(package_id);
  }

  async findByIdWithDeleted(package_id: number): Promise<Package | null> {
    return await Package.findByPk(package_id, { paranoid: false });
  }

  async findByNameAndCategory(name: string, category: PackageCategory): Promise<Package | null> {
    return await Package.findOne({ where: { name, category } });
  }

  async findAll(filters: PackageFilterOptions = {}): Promise<{ rows: Package[]; count: number }> {
    const { search, category, status, page = 1, limit = 10 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { package_code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Package.findAndCountAll({
      where,
      limit: cappedLimit,
      offset,
      order: [
        ['category', 'ASC'],
        ['base_price', 'ASC'],
      ],
    });
  }

  async findAllByCategory(category: PackageCategory): Promise<Package[]> {
    return await Package.findAll({
      where: { category, status: 'ACTIVE' },
      order: [['base_price', 'ASC']],
    });
  }

  async update(package_id: number, data: UpdatePackageDTO): Promise<[number, Package[]]> {
    return await Package.update(data, {
      where: { package_id },
      returning: true,
    });
  }

  async delete(package_id: number): Promise<number> {
    return await Package.destroy({ where: { package_id } });
  }

  async restore(package_id: number): Promise<void> {
    await Package.restore({ where: { package_id } });
  }
}
