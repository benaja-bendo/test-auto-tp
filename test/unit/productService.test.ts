import { describe, it, expect } from 'vitest';
import { ProductService } from '../../src/services/productService';

describe('ProductService', () => {
  const service = new ProductService();

  it('returns list of products', () => {
    const products = service.getAll();
    expect(products.length).toBeGreaterThan(0);
  });

  it('finds product by id', () => {
    const first = service.getAll()[0];
    expect(service.findById(first.id)).toEqual(first);
  });
});
