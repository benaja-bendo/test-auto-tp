import { Request, Response } from 'express';
import { ShippingService } from '../services/shippingService';

export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  getOptions = (req: Request, res: Response): void => {
    res.json(this.shippingService.getOptions());
  };

  getAllCarriers = async (req: Request, res: Response): Promise<void> => {
    try {
      const carriers = await this.shippingService.getAllCarriers();
      res.json(carriers);
    } catch (error) {
      console.error('Erreur dans le contrôleur getAllCarriers:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des transporteurs' });
    }
  };

  getCarrierById = async (req: Request, res: Response): Promise<void> => {
    try {
      const carrier = await this.shippingService.getCarrierById(req.params.id);
      if (!carrier) {
        res.status(404).json({ error: `Carrier with id ${req.params.id} not found` });
        return;
      }
      res.json(carrier);
    } catch (error) {
      console.error(`Erreur dans le contrôleur getCarrierById pour l'id ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erreur lors de la récupération du transporteur' });
    }
  };
}
