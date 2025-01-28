import { Request, Response } from 'express';
import { ProductService } from '../service/ProductService';
import { statusCode } from '../../../utils/constants';

export class ProductController {
  constructor(private productService = new ProductService()) {
    this.productService = productService;
  }

  async listAllProducts(req: Request, res: Response) {
    const products = await this.productService.listAllProducts();
    res.status(statusCode.OK).json(products);
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    res.status(statusCode.OK).json(product);
  }

  async createProduct(req: Request, res: Response) {
    const { name, description, price, stock } = req.body;
    const product = await this.productService.createProduct({
      name,
      description,
      price,
      stock,
    });
    res.status(statusCode.CREATED).json({ product });
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
    res.status(statusCode.OK).json({ product });
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.deleteProduct(id);
    res.status(statusCode.OK).json({ product });
  }
}
