import { Request, Response } from 'express';
import { UserService } from '../service/UserSerivce';
import { statusCode } from '../../../utils/constants';

export class UserController {
  constructor(private userService = new UserService()) {
    this.userService = userService;
  }

  async listAllUsers(req: Request, res: Response) {
    const users = await this.userService.listAllUsers();
    res.status(statusCode.OK).json(users);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    res.status(statusCode.OK).json(user);
  }

  async createUser(req: Request, res: Response) {
    const { name, email, phone, address, password } = req.body;
    const user = await this.userService.createUser({
      name,
      email,
      phone,
      address,
      password,
    });
    res.status(statusCode.CREATED).json(user);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, phone, address, password } = req.body;
    const user = await this.userService.updateUser(id, {
      name,
      email,
      phone,
      address,
      password,
    });
    res.status(statusCode.OK).json(user);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.deleteUser(id);
    res.status(statusCode.OK).json(user);
  }
}
