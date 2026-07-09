import { Op } from 'sequelize';
import { Staff, StaffStatus } from '../models/Staff.model';

export class StaffRepository {
  async findByEmail(email: string) {
    return Staff.findOne({ where: { email }, paranoid: false });
  }

  async findById(staff_id: number) {
    return Staff.findByPk(staff_id);
  }

  async create(data: Partial<Staff>, employee_id: string) {
    return Staff.create({ ...data, employee_id } as any);
  }

  async findAll(search?: string, page = 1, limit = 20) {
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { full_name:   { [Op.like]: `%${search}%` } },
        { email:       { [Op.like]: `%${search}%` } },
        { department:  { [Op.like]: `%${search}%` } },
        { designation: { [Op.like]: `%${search}%` } },
        { employee_id: { [Op.like]: `%${search}%` } },
      ];
    }
    return Staff.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });
  }

  async update(staff_id: number, data: Partial<Staff>) {
    const staff = await Staff.findByPk(staff_id);
    if (!staff) return null;
    return staff.update(data);
  }

  async softDelete(staff_id: number) {
    const staff = await Staff.findByPk(staff_id);
    if (!staff) return null;
    return staff.destroy();
  }

  async permanentDelete(staff_id: number) {
    const staff = await Staff.findByPk(staff_id, { paranoid: false });
    if (!staff) return null;
    return staff.destroy({ force: true });
  }

  async getLastEmployeeId(): Promise<string | null> {
    const last = await Staff.findOne({
      order: [['staff_id', 'DESC']],
      paranoid: false,
    });
    return last?.employee_id ?? null;
  }
}
