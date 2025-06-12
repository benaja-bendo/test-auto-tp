import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const { shippingMethod } = req.body;
    const order = await this.orderService.createOrder(shippingMethod);
    res.status(201).json(order);
  };
}
