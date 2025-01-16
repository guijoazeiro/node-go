import { query } from '../../../db';

export class UserRepository {
  constructor() {}

  async listAllUsers() {
    const sql = `SELECT id, name, email FROM users`;
    return await query(sql);
  }

  async getUserById(id: string) {
    const sql = `SELECT id, name, email FROM users WHERE id = $1`;
    return await query(sql, [id]);
  }

  async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const sql = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`;
    return await query(sql, [name, email, password]);
  }

  async deleteUser(id: string) {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING id, name, email`;
    return await query(sql, [id]);
  }
}
