import { CartItem } from '../models/cartItem';
import { ProductService } from './productService';

export class CartService {
  private items: CartItem[] = [];
  private productService: ProductService | null = null;

  constructor(productService?: ProductService) {
    if (productService) {
      this.productService = productService;
    }
  }

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

  async getTotal(): Promise<number> {
    if (!this.productService) {
      return 0;
    }

    let total = 0;
    for (const item of this.items) {
      const product = await this.productService.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    return total;
  }

  clear(): void {
    this.items = [];
  }

  setProductService(productService: ProductService): void {
    this.productService = productService;
  }
}
