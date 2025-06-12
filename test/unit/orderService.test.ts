import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartService } from '../../src/services/cartService';
import { OrderService } from '../../src/services/orderService';
import { PaymentService } from '../../src/services/paymentService';
import { ShippingService } from '../../src/services/shippingService';
import { ProductService } from '../../src/services/productService';
import { CartItem } from '../../src/models/cartItem';

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
    productService = new ProductService();
    service = new OrderService(cart, payment, shipping, productService);
  });

  it('creates order from cart', async () => {
    cart.addItem('1', 1);
    const order = await service.createOrder('standard');
    expect(order.status).toBe('shipped');
    expect(order.shippingCost).toBe(5);
    expect((payment.processPayment as any).mock.calls[0][1]).toBe(order.total);
  });

  it('calculates total correctly with multiple items', async () => {
    cart.addItem('1', 2); // 2 x Laptop à 1000
    cart.addItem('2', 1); // 1 x Phone à 800
    const order = await service.createOrder('standard');
    expect(order.total).toBe(2800 + order.shippingCost);
  });

  it('handles failed payment', async () => {
    payment.processPayment = vi.fn().mockResolvedValue(false);
    cart.addItem('1', 1);
    const order = await service.createOrder('standard');
    expect(order.status).toBe('pending');
    expect(shipping.shipOrder).not.toHaveBeenCalled();
  });

  it('clears cart after successful order', async () => {
    cart.addItem('1', 1);
    await service.createOrder('standard');
    expect(cart.getItems()).toHaveLength(0);
  });

  it('maintains cart items if order fails', async () => {
    payment.processPayment = vi.fn().mockResolvedValue(false);
    cart.addItem('1', 1);
    await service.createOrder('standard');
    const items = cart.getItems();
    expect(items, 'Le panier devrait contenir exactement un article').toHaveLength(1);
    expect(items[0], 'L\'article devrait avoir l\'ID et la quantité corrects').toEqual(expect.objectContaining<CartItem>({ productId: '1', quantity: 1 }));
  });
});
