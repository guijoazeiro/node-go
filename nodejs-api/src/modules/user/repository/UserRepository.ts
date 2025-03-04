import { query, generateUpdateQuery } from '../../../db';

type UserUpdateData = {
  [key: string]: string | number | boolean | null | undefined;
};

export class UserRepository {
  constructor() {}

  async listAllUsers() {
    const sql = `SELECT id, name, email, phone, address FROM users`;
    return query(sql);
  }

  async getUserById(id: string) {
    const sql = `SELECT id, name, email, phone, address FROM users WHERE id = $1`;
    const result = (await query(sql, [id])) || [];
    return result[0] || null;
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
    const result =
      (await query(sql, [name, email, phone, address, password])) || [];
    return result[0] || null;
  }

  async updateUser<T extends UserUpdateData>(id: string, user: T) {
    const updateQuery = await generateUpdateQuery('users', user, { id });
    return query(updateQuery);
  }

  async deleteUser(id: string) {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING id, name, email`;
    return query(sql, [id]);
  }
}
