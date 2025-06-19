import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartService } from '../../src/services/cartService';
import { ProductService } from '../../src/services/productService';

describe('CartService', () => {
  let service: CartService;
  let mockProductService: ProductService;

  beforeEach(() => {
    // Créer un mock du ProductService
    mockProductService = {
      findById: vi.fn().mockResolvedValue({ id: '1', price: 10 }),
      getAll: vi.fn(),
      fetchAll: vi.fn(),
      updateProduct: vi.fn()
    } as unknown as ProductService;
    
    service = new CartService(mockProductService);
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

  it('calcule correctement le total du panier', async () => {
    // Configurer le mock pour retourner différents produits
    mockProductService.findById = vi.fn().mockImplementation(async (id) => {
      if (id === '1') return { id: '1', price: 10 };
      if (id === '2') return { id: '2', price: 20 };
      return null;
    });

    service.addItem('1', 2); // 2 * 10 = 20
    service.addItem('2', 1); // 1 * 20 = 20
    
    const total = await service.getTotal();
    expect(total).toBe(40); // 20 + 20 = 40
  });
});
