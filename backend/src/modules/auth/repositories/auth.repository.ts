import { User } from '../../users/models/User.model';
import { Client } from '../../clients/models/Client.model';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
      include: [{ model: Client, as: 'client' }],
    });
  }

  async findById(user_id: number): Promise<User | null> {
    return await User.findByPk(user_id, {
      include: [{ model: Client, as: 'client' }],
    });
  }

  async updateRefreshToken(user_id: number, token: string | null): Promise<void> {
    await User.update({ refresh_token: token }, { where: { user_id } });
  }
}
