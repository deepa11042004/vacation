import { StaffRepository } from '../repositories/staff.repository';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { StaffStatus } from '../models/Staff.model';

export class StaffAuthService {
  private repo = new StaffRepository();

  async login(email: string, phone: string) {
    const staff = await this.repo.findByEmail(email);
    if (!staff) throw new AppError('Invalid email or phone number.', 401);
    if (staff.status !== StaffStatus.ACTIVE) throw new AppError('Your account is inactive.', 403);
    if (staff.phone !== phone) throw new AppError('Invalid email or phone number.', 401);

    const token = JwtUtil.generateAccessToken({
      user_id: staff.staff_id,
      email:   staff.email,
      role:    'STAFF',
    });

    const { ...staffData } = staff.toJSON();
    return { token, staff: staffData };
  }
}
