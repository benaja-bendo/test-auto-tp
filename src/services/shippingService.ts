export class ShippingService {
  async shipOrder(orderId: string): Promise<void> {
    // simulate external shipping API
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
