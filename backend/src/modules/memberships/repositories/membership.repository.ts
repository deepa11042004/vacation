import { Op, Transaction } from 'sequelize';
import { Membership } from '../models/Membership.model';
import { UpdateMembershipDTO } from '../dto/membership.dto';
import { MembershipFilterOptions, MembershipStatus } from '../types/membership.types';
import { IMembership } from '../interfaces/membership.interface';
import { Client } from '../../clients/models/Client.model';
import { Package } from '../../packages/models/Package.model';
import { User } from '../../users/models/User.model';

const MAX_LIMIT = 100;

const INCLUDE_ASSOCIATIONS = [
  { model: Client, as: 'client', attributes: ['client_id', 'client_code', 'first_name', 'last_name', 'email', 'mobile'] },
  { model: Package, as: 'package', attributes: ['package_id', 'name', 'category', 'unit_type'] },
  { model: User, as: 'salesConsultant', attributes: ['user_id', 'email'] },
  { model: User, as: 'takeOverManager', attributes: ['user_id', 'email'] },
];

export class MembershipRepository {
  async create(data: Partial<IMembership>, transaction?: Transaction): Promise<Membership> {
    return await Membership.create(data, { transaction });
  }

  async findById(membership_id: number): Promise<Membership | null> {
    return await Membership.findByPk(membership_id, { include: INCLUDE_ASSOCIATIONS });
  }

  async findByIdWithDeleted(membership_id: number): Promise<Membership | null> {
    return await Membership.findByPk(membership_id, { paranoid: false });
  }

  async findByClientId(client_id: number): Promise<Membership[]> {
    return await Membership.findAll({
      where: { client_id },
      include: INCLUDE_ASSOCIATIONS,
      order: [['created_at', 'DESC']],
    });
  }

  async findAll(filters: MembershipFilterOptions = {}): Promise<{ rows: Membership[]; count: number }> {
    const { search, client_id, package_id, status, page = 1, limit = 10 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (client_id) where.client_id = client_id;
    if (package_id) where.package_id = package_id;
    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { membership_number: { [Op.like]: `%${search}%` } },
        { reference_by: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Membership.findAndCountAll({
      where,
      include: INCLUDE_ASSOCIATIONS,
      limit: cappedLimit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }

  async update(membership_id: number, data: Partial<IMembership>, transaction?: Transaction): Promise<[number, Membership[]]> {
    return await Membership.update(data, {
      where: { membership_id },
      returning: true,
      transaction,
    });
  }

  async delete(membership_id: number): Promise<number> {
    return await Membership.destroy({ where: { membership_id } });
  }

  async restore(membership_id: number): Promise<void> {
    await Membership.restore({ where: { membership_id } });
  }
}
