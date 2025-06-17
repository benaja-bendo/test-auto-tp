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

  updateItem(productId: string, quantity: number): void {
    const existing = this.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity = quantity;
    } else if (quantity > 0) {
      this.items.push({ productId, quantity });
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId);
  }

  getItems(): CartItem[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }
}
