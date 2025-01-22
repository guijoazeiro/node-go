import { Router } from 'express';
import { OrderController } from '../controller/OrderController';
const orderRouter = Router();
const orderController = new OrderController();

orderRouter.get('/', (req, res) => orderController.listAllOrders(req, res));

orderRouter.get('/:id', (req, res) => orderController.getOrderById(req, res));

orderRouter.post('/', (req, res) => orderController.createOrder(req, res));

export default orderRouter;
