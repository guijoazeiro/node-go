import { generateUpdateQuery, query } from '../../../db';

type ProductUpdateData = {
  [key: string]: string | number | boolean | null | undefined;
};

export class ProductRepository {
  async listAllProducts() {
    const sql = `SELECT * FROM products`;
    return query(sql);
  }

  async getProductById(id: string) {
    const sql = `SELECT * FROM products WHERE id = $1`;
    return query(sql, [id]);
  }

  async createProduct({
    name,
    description,
    price,
    stock,
  }: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    const sql = `INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING id, name, description, price, stock`;
    return query(sql, [name, description, price, stock]);
  }

  async updateProduct(id: string, product: ProductUpdateData) {
    const updateQuery = await generateUpdateQuery('products', product, { id });
    return query(updateQuery);
  }

  async deleteProduct(id: string) {
    const sql = `DELETE FROM products WHERE id = $1 RETURNING id, name, description, price, stock`;
    return query(sql, [id]);
  }

  async updateStock(productId: string, quantity: number) {
    const updateQuery = await generateUpdateQuery(
      'products',
      { stock: quantity },
      { id: productId },
    );
    return query(updateQuery);
  }
}
