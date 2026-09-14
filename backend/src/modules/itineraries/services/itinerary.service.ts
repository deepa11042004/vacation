import { ItineraryRepository } from '../repositories/itinerary.repository';
import { CreateItineraryDTO, UpdateItineraryDTO, AddItineraryImageDTO } from '../dto/itinerary.dto';
import { ItineraryFilterOptions } from '../types/itinerary.types';
import { ITINERARY_CONSTANTS } from '../constants/itinerary.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import fs from 'fs/promises';
import path from 'path';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  private async generateUniqueSlug(base: string, ignoreId?: number): Promise<string> {
    const baseSlug = slugify(base) || 'itinerary';
    let candidate = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await this.itineraryRepository.findBySlugRaw(candidate);
      if (!existing || existing.itinerary_id === ignoreId) return candidate;
      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  async createItinerary(data: CreateItineraryDTO) {
    const slug = data.slug ? slugify(data.slug) : await this.generateUniqueSlug(data.name);

    if (data.slug) {
      const existing = await this.itineraryRepository.findBySlugRaw(slug);
      if (existing) {
        throw new AppError(ITINERARY_CONSTANTS.ERRORS.SLUG_EXISTS, 400);
      }
    }

    const newItinerary = await this.itineraryRepository.create({ ...data, slug });
    return this.getItineraryById(newItinerary.itinerary_id);
  }

  async getItineraryById(itinerary_id: number) {
    const itinerary = await this.itineraryRepository.findById(itinerary_id);
    if (!itinerary) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return itinerary.toJSON();
  }

  async getItineraryBySlug(slug: string) {
    const itinerary = await this.itineraryRepository.findBySlug(slug);
    if (!itinerary) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return itinerary.toJSON();
  }

  async getAllItineraries(filters: ItineraryFilterOptions) {
    const { rows, count } = await this.itineraryRepository.findAll(filters);
    const itineraries = rows.map((itinerary) => itinerary.toJSON());

    return {
      itineraries,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async updateItinerary(itinerary_id: number, data: UpdateItineraryDTO) {
    const itinerary = await this.itineraryRepository.findById(itinerary_id);
    if (!itinerary) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    let slug = data.slug;
    if (slug) {
      slug = slugify(slug);
      if (slug !== itinerary.slug) {
        const existing = await this.itineraryRepository.findBySlugRaw(slug);
        if (existing && existing.itinerary_id !== itinerary_id) {
          throw new AppError(ITINERARY_CONSTANTS.ERRORS.SLUG_EXISTS, 400);
        }
      }
    }

    await this.itineraryRepository.update(itinerary_id, { ...data, ...(slug ? { slug } : {}) });
    return this.getItineraryById(itinerary_id);
  }

  async softDeleteItinerary(itinerary_id: number) {
    const itinerary = await this.itineraryRepository.findById(itinerary_id);
    if (!itinerary) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    await this.itineraryRepository.delete(itinerary_id);
  }

  async restoreItinerary(itinerary_id: number) {
    const itinerary = await this.itineraryRepository.findByIdWithDeleted(itinerary_id);
    if (!itinerary) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (!itinerary.deleted_at) {
      throw new AppError('Itinerary is not deleted', 400);
    }
    await this.itineraryRepository.restore(itinerary_id);
  }

  async permanentDeleteItinerary(itinerary_id: number) {
    const itinerary = await this.itineraryRepository.findByIdWithDeleted(itinerary_id);
    if (!itinerary) throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    if (!itinerary.deleted_at) throw new AppError('Itinerary must be soft-deleted before permanent deletion', 400);
    await this.itineraryRepository.permanentDelete(itinerary_id);
  }

  // --- Gallery images ---

  async addItineraryImage(itinerary_id: number, data: AddItineraryImageDTO) {
    const itinerary = await this.itineraryRepository.findById(itinerary_id);
    if (!itinerary) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    const currentCount = await this.itineraryRepository.countImages(itinerary_id);
    if (currentCount >= 12) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.MAX_IMAGES_EXCEEDED, 400);
    }

    const newImage = await this.itineraryRepository.addImage({
      itinerary_id,
      image_path: data.image_path,
      sort_order: data.sort_order ?? 0,
    });

    return newImage.toJSON();
  }

  async deleteItineraryImage(itinerary_id: number, image_id: number) {
    const image = await this.itineraryRepository.findImageById(image_id);
    if (!image || image.itinerary_id !== itinerary_id) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.IMAGE_NOT_FOUND, 404);
    }

    const rawPath = image.getDataValue('image_path' as never) as string;
    const normalizedPath = rawPath.startsWith('/') ? rawPath : `/uploads/itineraries/${rawPath}`;
    const absolutePath = path.join(process.cwd(), 'public', normalizedPath);
    try {
      await fs.unlink(absolutePath);
    } catch (err) {
      console.warn(`Could not delete physical file at ${absolutePath}:`, err);
    }

    await this.itineraryRepository.deleteImage(image_id);
    return { success: true };
  }
}
