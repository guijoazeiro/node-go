import logger from '../../../config/logger';
import { UserRepository } from '../repository/UserRepository';
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(private userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async listAllUsers() {
    const users = await this.userRepository.listAllUsers();
    return users;
  }
  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    return user;
  }

  async createUser(name: string, email: string, password: string) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.createUser({
        name,
        email,
        password: encryptedPassword,
      });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.deleteUser(id);
    return user;
  }
}
