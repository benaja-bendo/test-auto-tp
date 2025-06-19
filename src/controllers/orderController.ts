import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export class OrderController {
  constructor(private orderService: OrderService) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, carrierId, paymentMethod, shippingAddressId, billingAddressId } = req.body;
      
      // Validation de base
      if (!customerId || !carrierId || !paymentMethod || !shippingAddressId || !billingAddressId) {
        res.status(400).json({ 
          error: 'Tous les champs sont obligatoires: customerId, carrierId, paymentMethod, shippingAddressId, billingAddressId' 
        });
        return;
      }
      
      const order = await this.orderService.createOrder({
        customerId: parseInt(customerId),
        carrierId,
        paymentMethod,
        shippingAddressId: parseInt(shippingAddressId),
        billingAddressId: parseInt(billingAddressId)
      });
      
      res.status(201).json(order);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({ error: 'Échec de la création de la commande' });
    }
  }
  
  async getCustomerOrders(req: Request, res: Response): Promise<void> {
    try {
      const customerId = parseInt(req.params.customerId);
      
      if (isNaN(customerId)) {
        res.status(400).json({ error: 'ID client invalide' });
        return;
      }
      
      const orders = await this.orderService.getCustomerOrders(customerId);
      res.json(orders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ error: 'Échec de la récupération des commandes' });
    }
  }
  
  async getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        res.status(400).json({ error: 'ID commande invalide' });
        return;
      }
      
      const order = await this.orderService.getOrderWithItems(orderId);
      res.json(order);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la commande:', error);
      res.status(500).json({ error: 'Échec de la récupération des détails de la commande' });
    }
  }
}
