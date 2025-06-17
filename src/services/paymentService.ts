import { Payment } from '../models/payment';
import axios from 'axios';

export class PaymentService {
  private apiUrl = 'http://localhost:3001/payments';

  async processPayment(orderId: string, amount: number): Promise<boolean> {
    // simulate external payment API
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      const response = await axios.get(this.apiUrl);
      // Adapter les données du JSON server au format de notre modèle Payment
      return response.data.map((payment: any) => ({
        id: payment.id,
        name: payment.method,
        description: payment.processor_response || payment.notes,
        fee: 0, // Par défaut, pas de frais supplémentaires
        enabled: payment.status !== 'failed' // Activer tous les moyens de paiement sauf ceux en échec
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des moyens de paiement:', error);
      return [];
    }
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      const payment = response.data;
      
      if (!payment) return undefined;
      
      return {
        id: payment.id,
        name: payment.method,
        description: payment.processor_response || payment.notes,
        fee: 0, // Par défaut, pas de frais supplémentaires
        enabled: payment.status !== 'failed' // Activer tous les moyens de paiement sauf ceux en échec
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du moyen de paiement ${id}:`, error);
      return undefined;
    }
  }
}
