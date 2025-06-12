import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  constructor(private productService: ProductService) {}

  getProducts = (req: Request, res: Response): void => {
    res.json(this.productService.getAll());
  };
}
