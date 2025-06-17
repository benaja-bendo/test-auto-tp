import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.findById(req.params.id);
      if (!product) {
        res.status(404).end();
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch product with id ${req.params.id}` });
    }
  };
}
