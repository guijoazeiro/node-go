import { query } from '../../../db';

export class OrderItemRepository {
  async listOrderItemsByOrderId(orderId: string) {
    const sql = `SELECT * FROM order_items WHERE order_id = $1`;
    return query(sql, [orderId]);
  }

  async createOrderItem(orderId: string, productId: string, quantity: number) {
    const sql = `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id, order_id, product_id, quantity`;
    return query(sql, [orderId, productId, quantity]);
  }

  async listAllOrderItems() {
    const sql = `SELECT * FROM order_items`;
    return query(sql);
  }
}
