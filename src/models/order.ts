import { CartItem } from './cartItem';

export interface Order {
  id: string;
  items: CartItem[];
  shippingMethod: string;
  shippingCost: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped';
}
