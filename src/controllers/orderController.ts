import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shippingMethod } = req.body;
      const cartItems = this.orderService.getCartItems();
      
      if (!cartItems || cartItems.length === 0) {
        res.status(400).json({ error: 'Le panier est vide' });
        return;
      }

      const order = await this.orderService.createOrder(shippingMethod);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
  };
}
