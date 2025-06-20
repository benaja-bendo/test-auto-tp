import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartService } from '../../src/services/cartService';
import { OrderService } from '../../src/services/orderService';
import { PaymentService } from '../../src/services/paymentService';
import { ShippingService } from '../../src/services/shippingService';
import { ProductService } from '../../src/services/productService';

describe('OrderService', () => {
  let cart: CartService;
  let payment: PaymentService;
  let shipping: ShippingService;
  let service: OrderService;
  let productService: ProductService;

  beforeEach(() => {
    cart = new CartService();
    payment = { processPayment: vi.fn().mockResolvedValue(true) } as unknown as PaymentService;
    shipping = {
      shipOrder: vi.fn().mockResolvedValue(undefined),
      getCost: vi.fn().mockReturnValue(5)
    } as unknown as ShippingService;
    
    // Mock du ProductService pour retourner un produit avec un prix
    productService = {
      findById: vi.fn().mockResolvedValue({ id: '1', name: 'Test Product', price: 10, stock: 5 }),
      updateProduct: vi.fn().mockResolvedValue({ id: '1', name: 'Test Product', price: 10, stock: 4 })
    } as unknown as ProductService;
    
    service = new OrderService(cart, payment, shipping, productService);
  });

  it('creates order from cart', async () => {
    cart.addItem('1', 1);
    const order = await service.createOrder({
      customerId: 1,
      carrierId: 'standard',
      paymentMethod: 'credit_card',
      shippingAddressId: 1,
      billingAddressId: 1
    });
    expect(order.status).toBe('shipped');
    expect(order.shippingCost).toBe(5);
    expect((payment.processPayment as any).mock.calls[0][1]).toBe(order.total);
  });
});
