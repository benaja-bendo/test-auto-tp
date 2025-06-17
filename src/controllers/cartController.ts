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

  updateItem = (req: Request, res: Response): void => {
    const { productId, quantity } = req.body as any;
    const qty = Number(quantity) || 1;
    
    // Si la quantité est 0, supprimer l'élément
    if (qty <= 0) {
      this.cartService.removeItem(productId);
    } else {
      this.cartService.updateItem(productId, qty);
    }
    
    res.status(200).json({ success: true });
  };

  removeItem = (req: Request, res: Response): void => {
    const { productId } = req.params;
    this.cartService.removeItem(productId);
    res.status(200).json({ success: true });
  };

  clearCart = (req: Request, res: Response): void => {
    this.cartService.clear();
    res.status(200).json({ success: true });
  };

  getItems = (req: Request, res: Response): void => {
    res.json(this.cartService.getItems());
  };
}
