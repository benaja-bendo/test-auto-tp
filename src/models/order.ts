import { CartItem } from './cartItem';

export interface Order {
  id: number;
  customerId: number;
  carrierId: string;
  paymentMethod: string;
  shippingAddressId: number;
  billingAddressId: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export class OrderEntity implements Order {
  id: number;
  customerId: number;
  carrierId: string;
  paymentMethod: string;
  shippingAddressId: number;
  billingAddressId: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Order>) {
    Object.assign(this, data);
    this.status = data.status || 'pending';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
