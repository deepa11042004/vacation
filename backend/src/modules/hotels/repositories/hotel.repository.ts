import { Op, Transaction } from 'sequelize';
import { Hotel } from '../models/Hotel.model';
import { HotelImage } from '../models/HotelImage.model';
import { UpdateHotelDTO } from '../dto/hotel.dto';
import { HotelFilterOptions } from '../types/hotel.types';
import { IHotel, IHotelImage } from '../interfaces/hotel.interface';

const MAX_LIMIT = 100;

export class HotelRepository {
  async create(data: Partial<IHotel>, transaction?: Transaction): Promise<Hotel> {
    return await Hotel.create(data, { transaction });
  }

  async findById(hotel_id: number): Promise<Hotel | null> {
    return await Hotel.findByPk(hotel_id, {
      include: [{ model: HotelImage, as: 'images' }],
    });
  }

  async findByIdWithDeleted(hotel_id: number): Promise<Hotel | null> {
    return await Hotel.findByPk(hotel_id, { paranoid: false });
  }

  async findByNameAndLocation(hotel_name: string, location_id: number): Promise<Hotel | null> {
    return await Hotel.findOne({ where: { hotel_name, location_id } });
  }

  async findAll(filters: HotelFilterOptions = {}): Promise<{ rows: Hotel[]; count: number }> {
    const { search, location_id, property_type, hotel_type, status, page = 1, limit = 10 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (location_id) {
      where.location_id = location_id;
    }

    if (property_type) {
      where.property_type = property_type;
    }

    if (hotel_type) {
      where.hotel_type = hotel_type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { hotel_name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Hotel.findAndCountAll({
      where,
      limit: cappedLimit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{ model: HotelImage, as: 'images' }],
      distinct: true, // Needed to ensure count is correct with includes
    });
  }

  async update(hotel_id: number, data: UpdateHotelDTO): Promise<[number, Hotel[]]> {
    return await Hotel.update(data, {
      where: { hotel_id },
      returning: true,
    });
  }

  async delete(hotel_id: number): Promise<number> {
    return await Hotel.destroy({ where: { hotel_id } });
  }

  async restore(hotel_id: number): Promise<void> {
    await Hotel.restore({ where: { hotel_id } });
  }

  // --- Hotel Images Methods ---

  async findImageById(image_id: number): Promise<HotelImage | null> {
    return await HotelImage.findByPk(image_id);
  }

  async addImage(data: Partial<IHotelImage>, transaction?: Transaction): Promise<HotelImage> {
    return await HotelImage.create(data, { transaction });
  }

  async countImages(hotel_id: number): Promise<number> {
    return await HotelImage.count({ where: { hotel_id } });
  }

  async deleteImage(image_id: number): Promise<number> {
    return await HotelImage.destroy({ where: { image_id } });
  }
}
