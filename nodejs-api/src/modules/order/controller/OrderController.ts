import { Request, Response } from 'express';
import { OrderService } from '../service/OrderService';
import HttpError from '../../../utils/errorHandler';

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
    try {
      const order = await this.orderService.createOrder(userId, products);
      res.json(order);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
