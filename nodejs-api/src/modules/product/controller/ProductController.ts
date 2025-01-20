import { Request, Response } from 'express';
import { ProductService } from '../service/ProductService';

export class ProductController {
  constructor(private productService = new ProductService()) {
    this.productService = productService;
  }

  async listAllProducts(req: Request, res: Response) {
    const products = await this.productService.listAllProducts();
    res.json(products);
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    res.json(product);
  }

  async createProduct(req: Request, res: Response) {
    const { name, description, price, stock } = req.body;
    const product = await this.productService.createProduct({
      name,
      description,
      price,
      stock,
    });
    res.json({ product });
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const product = await this.productService.updateProduct(id, {
      name,
      description,
      price,
      stock,
    });
    res.json({ product });
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.deleteProduct(id);
    res.json({ product });
  }
}
