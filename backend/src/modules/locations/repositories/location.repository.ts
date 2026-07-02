import { Op, Transaction } from 'sequelize';
import { Location } from '../models/Location.model';
import { UpdateLocationDTO } from '../dto/location.dto';
import { LocationFilterOptions } from '../types/location.types';
import { ILocation } from '../interfaces/location.interface';

const MAX_LIMIT = 100;

export class LocationRepository {
  async create(data: Partial<ILocation>, transaction?: Transaction): Promise<Location> {
    return await Location.create(data, { transaction });
  }

  async findById(location_id: number): Promise<Location | null> {
    return await Location.findByPk(location_id);
  }

  async findByIdWithDeleted(location_id: number): Promise<Location | null> {
    return await Location.findByPk(location_id, { paranoid: false });
  }

  async findByName(location_name: string): Promise<Location | null> {
    return await Location.findOne({ where: { location_name } });
  }

  async findAll(filters: LocationFilterOptions = {}): Promise<{ rows: Location[]; count: number }> {
    const { search, type, status, page = 1, limit = 10 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { location_name: { [Op.like]: `%${search}%` } },
        { country: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Location.findAndCountAll({
      where,
      limit: cappedLimit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }

  async update(location_id: number, data: UpdateLocationDTO): Promise<[number, Location[]]> {
    return await Location.update(data, {
      where: { location_id },
      returning: true,
    });
  }

  async delete(location_id: number): Promise<number> {
    return await Location.destroy({ where: { location_id } });
  }

  async restore(location_id: number): Promise<void> {
    await Location.restore({ where: { location_id } });
  }
}
