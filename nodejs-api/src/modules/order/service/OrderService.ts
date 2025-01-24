import logger from '../../../config/logger';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderRepository } from '../repository/OrderRepository';
import { ProductRepository } from '../../product/repository/ProductRepository';
import { rabbitmq } from '../../../config/rabbitmq';
import { UserRepository } from '../../user/repository/UserRepository';

export class OrderService {
  constructor(
    private orderRepository = new OrderRepository(),
    private orderItemRepository = new OrderItemRepository(),
    private productRepository = new ProductRepository(),
    private userRepository = new UserRepository(),
  ) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async listAllOrders() {
    return this.orderRepository.listAllOrders();
  }

  async getOrderById(id: string) {
    return this.orderRepository.getOrderById(id);
  }

  async createOrder(userId: string, products) {
    logger.info(userId, products);
    let total = 0;
    const orderItems = [];

    for (const product of products) {
      const { productId, quantity } = product;
      const productInfo =
        await this.productRepository.getProductById(productId);
      logger.info(productInfo);

      const subtotal = productInfo.price * quantity;
      total += subtotal;

      orderItems.push({
        product_id: productId,
        quantity,
        unitPrice: productInfo.price,
        subtotal,
      });

      const stockUpdated = productInfo.stock - quantity;

      await this.productRepository.updateStock(productId, stockUpdated);
    }

    const order = await this.orderRepository.createOrder(userId, total);

    const userInfo = await this.userRepository.getUserById(userId);

    for (const orderItem of orderItems) {
      await this.orderItemRepository.createOrderItem(
        order.id,
        orderItem.product_id,
        orderItem.quantity,
        orderItem.unitPrice,
      );
    }

    const orderMessage = { order, user: userInfo, items: orderItems };

    await rabbitmq.sendToQueue('order', orderMessage);
    return orderMessage;
  }
}
