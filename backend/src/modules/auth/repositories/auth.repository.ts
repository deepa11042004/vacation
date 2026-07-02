import { User } from '../../users/models/User.model';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findById(user_id: number): Promise<User | null> {
    return await User.findByPk(user_id);
  }

  async updateRefreshToken(user_id: number, token: string | null): Promise<void> {
    await User.update({ refresh_token: token }, { where: { user_id } });
  }
}
