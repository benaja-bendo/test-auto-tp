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

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const updates = req.body;
      const updatedProduct = await this.productService.updateProduct(req.params.id, updates);
      
      if (!updatedProduct) {
        res.status(404).json({ error: `Product with id ${req.params.id} not found` });
        return;
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: `Failed to update product with id ${req.params.id}` });
    }
  };
}
