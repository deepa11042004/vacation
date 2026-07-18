import { Op } from 'sequelize';
import { TravelQuery } from '../models/TravelQuery.model';
import { ITravelQuery, TravelQueryStatus, TravelQueryType } from '../interfaces/travel-query.interface';

export interface TravelQueryFilters {
  status?: TravelQueryStatus;
  query_type?: TravelQueryType;
  search?: string;
  page?: number;
  limit?: number;
}

export class TravelQueryRepository {
  async create(data: Partial<ITravelQuery>): Promise<TravelQuery> {
    return TravelQuery.create(data);
  }

  async findAll(filters: TravelQueryFilters = {}): Promise<{ rows: TravelQuery[]; count: number }> {
    const { status, query_type, search, page = 1, limit = 20 } = filters;
    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (query_type) where.query_type = query_type;
    if (search) {
      where[Op.or as unknown as string] = [
        { card_number: { [Op.like]: `%${search}%` } },
      ];
    }

    return TravelQuery.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Math.min(limit, 100),
      offset: (page - 1) * Math.min(limit, 100),
    });
  }

  async findById(query_id: number): Promise<TravelQuery | null> {
    return TravelQuery.findByPk(query_id);
  }

  async update(query_id: number, data: Partial<ITravelQuery>): Promise<void> {
    await TravelQuery.update(data, { where: { query_id } });
  }
}
