import { describe, it, expect, beforeEach } from 'vitest';
import { ProductService } from '../../src/services/productService';

describe('ProductService', () => {
  let service: ProductService;
  
  beforeEach(() => {
    // Définir NODE_ENV pour les tests
    process.env.NODE_ENV = 'test';
    service = new ProductService();
  });

  it('returns list of products', async () => {
    const products = await service.getAll();
    expect(products.length).toBeGreaterThan(0);
  });

  it('finds product by id', async () => {
    // Puisque nous utilisons des données fictives en mode test,
    // nous devons adapter le test pour qu'il fonctionne avec ces données
    const productId = '1';
    const found = await service.findById(productId);
    expect(found).toBeDefined();
    expect(found?.id).toBe(productId);
  });
  
  it('updates product stock', async () => {
    const productId = '1';
    const updatedProduct = await service.updateProduct(productId, { stock: 3 });
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.stock).toBe(3);
  });
});
