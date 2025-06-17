import { Carrier } from '../models/carrier';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

const options: ShippingOption[] = [
  { id: 'standard', name: 'Standard', price: 5 },
  { id: 'express', name: 'Express', price: 10 }
];

const carriers: Carrier[] = [
  { id: 'trk001', name: 'Express Delivery', price: 10, deliveryTime: '1-2 days', description: 'Fast delivery service' },
  { id: 'trk002', name: 'Standard Delivery', price: 5, deliveryTime: '3-5 days', description: 'Regular delivery service' },
  { id: 'trk003', name: 'Economy Delivery', price: 3, deliveryTime: '5-7 days', description: 'Budget-friendly delivery option' }
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

  getAllCarriers(): Carrier[] {
    return carriers;
  }

  getCarrierById(id: string): Carrier | undefined {
    return carriers.find(carrier => carrier.id === id);
  }
}
