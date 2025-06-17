import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from '../../src/services/cartService';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('ajoute des articles au panier', () => {
    service.addItem('1', 2);
    expect(service.getItems()).toEqual([{ productId: '1', quantity: 2 }]);
  });

  it('met à jour la quantité d\'un article existant', () => {
    service.addItem('1', 2);
    service.addItem('1', 3);
    const items = service.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it('gère plusieurs articles différents', () => {
    service.addItem('1', 2);
    service.addItem('2', 1);
    service.addItem('3', 3);
    const items = service.getItems();
    expect(items).toHaveLength(3);
    expect(items.map(item => item.quantity)).toEqual([2, 1, 3]);
  });

  it('vérifie la présence d\'un article', () => {
    service.addItem('1', 2);
    const items = service.getItems();
    expect(items.some(item => item.productId === '1')).toBe(true);
    expect(items.some(item => item.productId === '999')).toBe(false);
  });

  it('vide le panier', () => {
    service.addItem('1', 2);
    service.addItem('2', 1);
    service.clear();
    expect(service.getItems()).toEqual([]);
  });

  it('retourne un tableau vide pour un nouveau panier', () => {
    expect(service.getItems()).toEqual([]);
  });
});
