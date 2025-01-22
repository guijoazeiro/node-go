import { Request, Response } from 'express';
import { OrderService } from '../service/OrderService';

export class OrderController {
  constructor(private orderService = new OrderService()) {
    this.orderService = orderService;
  }

  async listAllOrders(req: Request, res: Response) {
    const orders = await this.orderService.listAllOrders();
    res.json(orders);
  }

  async getOrderById(req: Request, res: Response) {
    const { id } = req.params;
    const order = await this.orderService.getOrderById(id);
    res.json(order);
  }

  async createOrder(req: Request, res: Response) {
    const { userId, products } = req.body;
    const order = await this.orderService.createOrder(userId, products);
    res.json(order);
  }
}
