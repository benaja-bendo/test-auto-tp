import { CartItem } from '../models/cartItem';

export class CartService {
  private items: CartItem[] = [];

  addItem(productId: string, quantity = 1): void {
    const existing = this.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }
}
