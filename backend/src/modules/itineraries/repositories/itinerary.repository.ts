import { Op, Transaction } from 'sequelize';
import { Itinerary } from '../models/Itinerary.model';
import { ItineraryImage } from '../models/ItineraryImage.model';
import { UpdateItineraryDTO } from '../dto/itinerary.dto';
import { ItineraryFilterOptions } from '../types/itinerary.types';
import { IItinerary, IItineraryImage } from '../interfaces/itinerary.interface';

const MAX_LIMIT = 100;

export class ItineraryRepository {
  async create(data: Partial<IItinerary>, transaction?: Transaction): Promise<Itinerary> {
    return await Itinerary.create(data, { transaction });
  }

  async findById(itinerary_id: number): Promise<Itinerary | null> {
    return await Itinerary.findByPk(itinerary_id, {
      include: [{ model: ItineraryImage, as: 'gallery' }],
    });
  }

  async findBySlug(slug: string): Promise<Itinerary | null> {
    return await Itinerary.findOne({
      where: { slug },
      include: [{ model: ItineraryImage, as: 'gallery' }],
    });
  }

  async findByIdWithDeleted(itinerary_id: number): Promise<Itinerary | null> {
    return await Itinerary.findByPk(itinerary_id, { paranoid: false });
  }

  async findBySlugRaw(slug: string): Promise<Itinerary | null> {
    return await Itinerary.findOne({ where: { slug }, paranoid: false });
  }

  async findAll(filters: ItineraryFilterOptions = {}): Promise<{ rows: Itinerary[]; count: number }> {
    const { search, type, status, category, deleted = false, includeDeleted = false, page = 1, limit = 10, sort } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (deleted) where.deleted_at = { [Op.ne]: null };

    if (type) where.type = type;
    if (category) where.category = category;
    if (status && !deleted && !includeDeleted) where.status = status;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { destination: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Itinerary.findAndCountAll({
      where,
      paranoid: !deleted && !includeDeleted,
      limit: cappedLimit,
      offset,
      distinct: true,
      include: [{ model: ItineraryImage, as: 'gallery' }],
      order: sort === 'name'
        ? [['name', 'ASC'], ['itinerary_id', 'ASC']]
        : [['created_at', 'DESC'], ['itinerary_id', 'DESC']],
    });
  }

  async update(itinerary_id: number, data: UpdateItineraryDTO): Promise<[number, Itinerary[]]> {
    return await Itinerary.update(data, {
      where: { itinerary_id },
      returning: true,
    });
  }

  async delete(itinerary_id: number): Promise<number> {
    return await Itinerary.destroy({ where: { itinerary_id } });
  }

  async restore(itinerary_id: number): Promise<void> {
    await Itinerary.restore({ where: { itinerary_id } });
  }

  async permanentDelete(itinerary_id: number): Promise<void> {
    await Itinerary.destroy({ where: { itinerary_id }, force: true });
  }

  // --- Gallery image methods ---

  async findImageById(image_id: number): Promise<ItineraryImage | null> {
    return await ItineraryImage.findByPk(image_id);
  }

  async addImage(data: Partial<IItineraryImage>, transaction?: Transaction): Promise<ItineraryImage> {
    return await ItineraryImage.create(data, { transaction });
  }

  async countImages(itinerary_id: number): Promise<number> {
    return await ItineraryImage.count({ where: { itinerary_id } });
  }

  async deleteImage(image_id: number): Promise<number> {
    return await ItineraryImage.destroy({ where: { image_id } });
  }
}
