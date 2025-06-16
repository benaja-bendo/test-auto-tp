import { Request, Response } from 'express';
import { CartService } from '../services/cartService';

export class CartController {
  constructor(private cartService: CartService) {}

  addItem = (req: Request, res: Response): void => {
    const { productId, quantity } = req.body as any;
    const qty = Number(quantity) || 1;
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
}
