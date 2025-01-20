import logger from '../../../config/logger';
import { UserRepository } from '../repository/UserRepository';
import bcrypt from 'bcryptjs';

interface UserUpdateData {
  [key: string]: string | number | boolean | null | undefined;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
}

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

  async createUser({
    name,
    email,
    phone,
    address,
    password,
  }: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
  }) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.createUser({
        name,
        email,
        phone,
        address,
        password: encryptedPassword,
      });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateUser(id: string, user: UserUpdateData) {
    const userUpdated = await this.userRepository.updateUser(id, user);
    return userUpdated;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.deleteUser(id);
    return user;
  }
}
