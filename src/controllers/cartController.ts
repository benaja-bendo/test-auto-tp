import { Request, Response } from 'express';
import { CartService } from '../services/cartService';

export class CartController {
  constructor(private cartService: CartService) {}

  addItem = (req: Request, res: Response): void => {
    const { productId, quantity } = req.body;
    this.cartService.addItem(productId, quantity);
    res.status(201).end();
  };

  getCart = (req: Request, res: Response): void => {
    res.json(this.cartService.getItems());
  };
}
