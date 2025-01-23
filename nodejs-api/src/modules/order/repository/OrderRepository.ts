import { query } from '../../../db';

export class OrderRepository {
  async listAllOrders() {
    const sql = `SELECT * FROM orders`;
    return query(sql);
  }

  async getOrderById(id: string) {
    const sql = `SELECT * FROM orders WHERE id = $1`;
    return query(sql, [id]);
  }

  async createOrder(userId: string, total: number) {
    const sql = `INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, user_id, created_at, total`;
    return query(sql, [userId, total]);
  }
}
