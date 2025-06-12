import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from '../../src/services/cartService';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('adds items to cart', () => {
    service.addItem('1', 2);
    expect(service.getItems()).toEqual([{ productId: '1', quantity: 2 }]);
  });

  it('clears cart', () => {
    service.addItem('1', 2);
    service.clear();
    expect(service.getItems()).toEqual([]);
  });
});
