import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  constructor(private productService: ProductService) {}

  getProducts = (req: Request, res: Response): void => {
    res.json(this.productService.getAll());
  };

  getProduct = (req: Request, res: Response): void => {
    const product = this.productService.findById(req.params.id);
    if (!product) {
      res.status(404).end();
      return;
    }
    res.json(product);
  };
}
