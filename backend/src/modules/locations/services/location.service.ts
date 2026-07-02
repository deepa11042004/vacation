import { LocationRepository } from '../repositories/location.repository';
import { CreateLocationDTO, UpdateLocationDTO } from '../dto/location.dto';
import { LocationFilterOptions } from '../types/location.types';
import { LOCATION_CONSTANTS } from '../constants/location.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { Hotel } from '../../hotels/models/Hotel.model';

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async createLocation(data: CreateLocationDTO) {
    const existing = await this.locationRepository.findByName(data.location_name);
    if (existing) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.NAME_EXISTS, 400);
    }

    const newLocation = await this.locationRepository.create(data);
    return newLocation.toJSON();
  }

  async getLocationById(location_id: number) {
    const location = await this.locationRepository.findById(location_id);
    if (!location) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return location.toJSON();
  }

  async getAllLocations(filters: LocationFilterOptions) {
    const { rows, count } = await this.locationRepository.findAll(filters);
    const locations = rows.map((location) => location.toJSON());

    return {
      locations,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async updateLocation(location_id: number, data: UpdateLocationDTO) {
    const location = await this.locationRepository.findById(location_id);
    if (!location) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (data.location_name && data.location_name !== location.location_name) {
      const existing = await this.locationRepository.findByName(data.location_name);
      if (existing) {
        throw new AppError(LOCATION_CONSTANTS.ERRORS.NAME_EXISTS, 400);
      }
    }

    await this.locationRepository.update(location_id, data);
    return this.getLocationById(location_id);
  }

  async softDeleteLocation(location_id: number) {
    const location = await this.locationRepository.findById(location_id);
    if (!location) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    // Check if there are associated hotels (using Hotel model directly or via raw lookup)
    const associatedHotels = await Hotel.count({ where: { location_id } });
    if (associatedHotels > 0) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.DELETE_RESTRICTED, 400);
    }

    await this.locationRepository.delete(location_id);
  }

  async restoreLocation(location_id: number) {
    const location = await this.locationRepository.findByIdWithDeleted(location_id);
    if (!location) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (!location.deleted_at) {
      throw new AppError('Location is not deleted', 400);
    }

    await this.locationRepository.restore(location_id);
  }
}
