import { Enquiry } from '../models/Enquiry.model';
import { IEnquiry, EnquiryStatus } from '../interfaces/enquiry.interface';
import { Op } from 'sequelize';

export interface EnquiryFilterOptions {
  search?: string;
  status?: EnquiryStatus;
  page?: number;
  limit?: number;
}

export class EnquiryRepository {
  async create(data: Partial<IEnquiry>): Promise<Enquiry> {
    return await Enquiry.create(data);
  }

  async findById(id: number): Promise<Enquiry | null> {
    return await Enquiry.findByPk(id);
  }

  async findAll(options: EnquiryFilterOptions = {}): Promise<{ rows: Enquiry[]; count: number }> {
    const { search, status, page = 1, limit = 20 } = options;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { hotel_name: { [Op.like]: `%${search}%` } },
        { query: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Enquiry.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { rows, count };
  }

  async update(id: number, data: Partial<IEnquiry>): Promise<[number]> {
    return await Enquiry.update(data, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await Enquiry.destroy({ where: { id } });
  }
}
