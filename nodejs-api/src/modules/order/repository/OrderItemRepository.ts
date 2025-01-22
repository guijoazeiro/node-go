import { query } from '../../../db';

export class OrderItemRepository {
  async listOrderItemsByOrderId(orderId: string) {
    const sql = `SELECT * FROM order_items WHERE order_id = $1`;
    return query(sql, [orderId]);
  }

  async createOrderItem(
    orderId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
  ) {
    const sql = `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING id, order_id, product_id, quantity, unit_price, subtotal`;
    return query(sql, [orderId, productId, quantity, unitPrice]);
  }

  async listAllOrderItems() {
    const sql = `SELECT * FROM order_items`;
    return query(sql);
  }
}
