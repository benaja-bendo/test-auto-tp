import { Payment } from '../models/payment';

const paymentMethods: Payment[] = [
  { id: 'pay001', name: 'Credit Card', description: 'Pay with Visa, Mastercard, or American Express', fee: 0, enabled: true },
  { id: 'pay002', name: 'PayPal', description: 'Pay with your PayPal account', fee: 0, enabled: true },
  { id: 'pay003', name: 'Bank Transfer', description: 'Pay directly from your bank account', fee: 0, enabled: true }
];

export class PaymentService {
  async processPayment(orderId: string, amount: number): Promise<boolean> {
    // simulate external payment API
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
  }

  getAllPayments(): Payment[] {
    return paymentMethods;
  }

  getPaymentById(id: string): Payment | undefined {
    return paymentMethods.find(payment => payment.id === id);
  }
}
