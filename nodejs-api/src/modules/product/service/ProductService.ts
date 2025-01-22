import { ProductRepository } from '../repository/ProductRepository';

interface UserUpdateData {
  [key: string]: string | number | boolean | null | undefined;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export class ProductService {
  constructor(private productRepository = new ProductRepository()) {
    this.productRepository = productRepository;
  }

  async listAllProducts() {
    return this.productRepository.listAllProducts();
  }

  async getProductById(id: string) {
    return this.productRepository.getProductById(id);
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
    return this.productRepository.createProduct({
      name,
      description,
      price,
      stock,
    });
  }

  async updateProduct(id: string, product: UserUpdateData) {
    return this.productRepository.updateProduct(id, product);
  }

  async deleteProduct(id: string) {
    return this.productRepository.deleteProduct(id);
  }
}
