import { Request, Response } from 'express';
import { CartService } from '../services/cartService';
import { ProductService } from '../services/productService';

export class CartController {
  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  addItem = (req: Request, res: Response): void => {
    const { productId, quantity } = req.body as any;
    const qty = Number(quantity) || 1;
    const product = this.productService.findById(productId);
    
    if (!product) {
      res.status(400).json({ error: 'Produit non trouvé' });
      return;
    }

    this.cartService.addItem(productId, qty);
    if (req.is('application/json')) {
      res.status(201).end();
    } else {
      res.redirect('/cart');
    }
  };

  getCart = (req: Request, res: Response): void => {
    res.json(this.cartService.getItems());
  };

  clearCart = (req: Request, res: Response): void => {
    this.cartService.clear();
    res.status(204).end();
  };
}
