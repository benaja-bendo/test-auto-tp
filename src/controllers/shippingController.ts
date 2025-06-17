import { Request, Response } from 'express';
import { ShippingService } from '../services/shippingService';

export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  getOptions = (req: Request, res: Response): void => {
    res.json(this.shippingService.getOptions());
  };

  getAllCarriers = (req: Request, res: Response): void => {
    res.json(this.shippingService.getAllCarriers());
  };

  getCarrierById = (req: Request, res: Response): void => {
    const carrier = this.shippingService.getCarrierById(req.params.id);
    if (!carrier) {
      res.status(404).json({ error: `Carrier with id ${req.params.id} not found` });
      return;
    }
    res.json(carrier);
  };
}
