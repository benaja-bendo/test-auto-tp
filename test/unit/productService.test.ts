import { describe, it, expect } from 'vitest';
import { ProductService } from '../../src/services/productService';

describe('ProductService', () => {
  const service = new ProductService();

  it('returns list of products', async () => {
    const products = await service.getAll();
    expect(products.length).toBeGreaterThan(0);
  });

  it('finds product by id', async () => {
    const products = await service.getAll();
    const first = products[0];
    const found = await service.findById(first.id);
    expect(found).toEqual(first);
  });
});
