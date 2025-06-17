import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  getAllPayments = (req: Request, res: Response): void => {
    res.json(this.paymentService.getAllPayments());
  };

  getPaymentById = (req: Request, res: Response): void => {
    const payment = this.paymentService.getPaymentById(req.params.id);
    if (!payment) {
      res.status(404).json({ error: `Payment method with id ${req.params.id} not found` });
      return;
    }
    res.json(payment);
  };
}