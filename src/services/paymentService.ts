export class PaymentService {
  async processPayment(orderId: string, amount: number): Promise<boolean> {
    // simulate external payment API
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
  }
}
