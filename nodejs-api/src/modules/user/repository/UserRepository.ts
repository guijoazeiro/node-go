import { query } from '../../../db';

export class UserRepository {
  constructor() {}

  async listAllUsers() {
    const sql = `SELECT id, name, email, phone, address FROM users`;
    return await query(sql);
  }

  async getUserById(id: string) {
    const sql = `SELECT id, name, email, phone, address FROM users WHERE id = $1`;
    return await query(sql, [id]);
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
    const sql = `INSERT INTO users (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email`;
    return await query(sql, [name, email, phone, address, password]);
  }

  async deleteUser(id: string) {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING id, name, email`;
    return await query(sql, [id]);
  }
}
