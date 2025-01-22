import logger from '../../../config/logger';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderRepository } from '../repository/OrderRepository';
import { ProductRepository } from '../../product/repository/ProductRepository';

export class OrderService {
  constructor(
    private orderRepository = new OrderRepository(),
    private orderItemRepository = new OrderItemRepository(),
    private productRepository = new ProductRepository(),
  ) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
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

      const fullProduct = productInfo[0];

      const subtotal = fullProduct.price * quantity;
      total += subtotal;

      orderItems.push({
        product_id: productId,
        quantity,
        unitPrice: fullProduct.price,
        subtotal,
      });

      const stockUpdated = fullProduct.stock - quantity;

      await this.productRepository.updateStock(productId, stockUpdated);
    }

    const order = await this.orderRepository.createOrder(userId, total);

    for (const orderItem of orderItems) {
      await this.orderItemRepository.createOrderItem(
        order.id,
        orderItem.product_id,
        orderItem.quantity,
        orderItem.unitPrice,
      );
    }
    return { order, items: orderItems };
  }
}
