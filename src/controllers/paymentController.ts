import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await this.paymentService.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error('Erreur dans le contrôleur getAllPayments:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des moyens de paiement' });
    }
  };

  getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await this.paymentService.getPaymentById(req.params.id);
      if (!payment) {
        res.status(404).json({ error: `Payment method with id ${req.params.id} not found` });
        return;
      }
      res.json(payment);
    } catch (error) {
      console.error(`Erreur dans le contrôleur getPaymentById pour l'id ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erreur lors de la récupération du moyen de paiement' });
    }
  };
}