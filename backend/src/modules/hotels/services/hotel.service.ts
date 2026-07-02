import { HotelRepository } from '../repositories/hotel.repository';
import { LocationRepository } from '../../locations/repositories/location.repository';
import { CreateHotelDTO, UpdateHotelDTO, AddHotelImageDTO } from '../dto/hotel.dto';
import { HotelFilterOptions } from '../types/hotel.types';
import { HOTEL_CONSTANTS } from '../constants/hotel.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import fs from 'fs/promises';
import path from 'path';

export class HotelService {
  private hotelRepository: HotelRepository;
  private locationRepository: LocationRepository;

  constructor() {
    this.hotelRepository = new HotelRepository();
    this.locationRepository = new LocationRepository();
  }

  async createHotel(data: CreateHotelDTO) {
    const location = await this.locationRepository.findById(data.location_id);
    if (!location) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.LOCATION_NOT_FOUND, 404);
    }

    const existing = await this.hotelRepository.findByNameAndLocation(data.hotel_name, data.location_id);
    if (existing) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.NAME_EXISTS_IN_LOCATION, 400);
    }

    const newHotel = await this.hotelRepository.create(data);
    return this.getHotelById(newHotel.hotel_id);
  }

  async getHotelById(hotel_id: number) {
    const hotel = await this.hotelRepository.findById(hotel_id);
    if (!hotel) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return hotel.toJSON();
  }

  async getAllHotels(filters: HotelFilterOptions) {
    const { rows, count } = await this.hotelRepository.findAll(filters);
    const hotels = rows.map((hotel) => hotel.toJSON());

    return {
      hotels,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async updateHotel(hotel_id: number, data: UpdateHotelDTO) {
    const hotel = await this.hotelRepository.findById(hotel_id);
    if (!hotel) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    const targetLocationId = data.location_id ?? hotel.location_id;
    const targetHotelName = data.hotel_name ?? hotel.hotel_name;

    // Check location exists if changed
    if (data.location_id && data.location_id !== hotel.location_id) {
      const location = await this.locationRepository.findById(data.location_id);
      if (!location) {
        throw new AppError(HOTEL_CONSTANTS.ERRORS.LOCATION_NOT_FOUND, 404);
      }
    }

    // Check unique hotel name in location
    if (
      (data.hotel_name && data.hotel_name !== hotel.hotel_name) ||
      (data.location_id && data.location_id !== hotel.location_id)
    ) {
      const existing = await this.hotelRepository.findByNameAndLocation(targetHotelName, targetLocationId);
      if (existing && existing.hotel_id !== hotel.hotel_id) {
        throw new AppError(HOTEL_CONSTANTS.ERRORS.NAME_EXISTS_IN_LOCATION, 400);
      }
    }

    await this.hotelRepository.update(hotel_id, data);
    return this.getHotelById(hotel_id);
  }

  async softDeleteHotel(hotel_id: number) {
    const hotel = await this.hotelRepository.findById(hotel_id);
    if (!hotel) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    await this.hotelRepository.delete(hotel_id);
  }

  async restoreHotel(hotel_id: number) {
    const hotel = await this.hotelRepository.findByIdWithDeleted(hotel_id);
    if (!hotel) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (!hotel.deleted_at) {
      throw new AppError('Hotel is not deleted', 400);
    }

    await this.hotelRepository.restore(hotel_id);
  }

  // --- Hotel Images Services ---

  async addHotelImage(hotel_id: number, data: AddHotelImageDTO) {
    const hotel = await this.hotelRepository.findById(hotel_id);
    if (!hotel) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    const currentCount = await this.hotelRepository.countImages(hotel_id);
    if (currentCount >= 6) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.MAX_IMAGES_EXCEEDED, 400);
    }

    const newImage = await this.hotelRepository.addImage({
      hotel_id,
      image_path: data.image_path,
      sort_order: data.sort_order ?? 0,
    });

    return newImage.toJSON();
  }

  async deleteHotelImage(hotel_id: number, image_id: number) {
    const image = await this.hotelRepository.findImageById(image_id);
    if (!image || image.hotel_id !== hotel_id) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.IMAGE_NOT_FOUND, 404);
    }

    // Attempt to delete physical file
    const absolutePath = path.join(process.cwd(), 'public', image.image_path);
    try {
      await fs.unlink(absolutePath);
    } catch (err) {
      console.warn(`Could not delete physical file at ${absolutePath}:`, err);
    }

    await this.hotelRepository.deleteImage(image_id);
    return { success: true };
  }
}
