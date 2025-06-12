export interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

const options: ShippingOption[] = [
  { id: 'standard', name: 'Standard', price: 5 },
  { id: 'express', name: 'Express', price: 10 }
];

export class ShippingService {
  getOptions(): ShippingOption[] {
    return options;
  }

  getCost(optionId: string): number {
    return options.find(o => o.id === optionId)?.price ?? 0;
  }

  async shipOrder(orderId: string, optionId: string): Promise<void> {
    // simulate external shipping API using selected option
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
