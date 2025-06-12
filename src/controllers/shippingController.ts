import { Request, Response } from 'express';
import { ShippingService } from '../services/shippingService';

export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  getOptions = (req: Request, res: Response): void => {
    res.json(this.shippingService.getOptions());
  };
}
