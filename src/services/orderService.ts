import { CartService } from './cartService';
import { PaymentService } from './paymentService';
import { ShippingService } from './shippingService';
import { ProductService } from './productService';
import { Order } from '../models/order';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private productService: ProductService
  ) {}

  async createOrder(): Promise<Order> {
    const items = this.cartService.getItems();
    const total = items.reduce((sum, item) => {
      const product = this.productService.findById(item.productId);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);

    const order: Order = { id: uuidv4(), items, total, status: 'pending' };
    const paymentSuccess = await this.paymentService.processPayment(order.id, order.total);
    if (paymentSuccess) {
      order.status = 'paid';
      await this.shippingService.shipOrder(order.id);
      order.status = 'shipped';
    }
    this.cartService.clear();
    return order;
  }
}
