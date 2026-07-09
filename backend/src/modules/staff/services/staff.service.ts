import { StaffRepository } from '../repositories/staff.repository';
import { AppError } from '../../../shared/middlewares/error.middleware';

function generateEmployeeId(lastId: string | null): string {
  const lastNum = lastId ? parseInt(lastId.replace('EMP-', ''), 10) : 0;
  return `EMP-${String(lastNum + 1).padStart(3, '0')}`;
}

export class StaffService {
  private repo = new StaffRepository();

  async createStaff(data: any) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new AppError('A staff member with this email already exists.', 400);

    const lastId    = await this.repo.getLastEmployeeId();
    const employee_id = generateEmployeeId(lastId);

    const staff = await this.repo.create(data, employee_id);
    return staff.toJSON();
  }

  async getAllStaff(search?: string, page = 1, limit = 20) {
    const { rows, count } = await this.repo.findAll(search, page, limit);
    return { staff: rows.map(s => s.toJSON()), total: count, page, limit };
  }

  async getStaffById(staff_id: number) {
    const staff = await this.repo.findById(staff_id);
    if (!staff) throw new AppError('Staff member not found.', 404);
    return staff.toJSON();
  }

  async updateStaff(staff_id: number, data: any) {
    const staff = await this.repo.update(staff_id, data);
    if (!staff) throw new AppError('Staff member not found.', 404);
    return staff.toJSON();
  }

  async deleteStaff(staff_id: number) {
    const result = await this.repo.softDelete(staff_id);
    if (!result) throw new AppError('Staff member not found.', 404);
  }

  async permanentDeleteStaff(staff_id: number) {
    const result = await this.repo.permanentDelete(staff_id);
    if (!result) throw new AppError('Staff member not found.', 404);
  }
}
