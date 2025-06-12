import request from 'supertest';
import app from '../../src/app';
import { describe, it, expect } from 'vitest';

describe('Order flow E2E', () => {
  it('user can browse, add to cart and order', async () => {
    const products = await request(app).get('/api/products');
    const productId = products.body[0].id;
    await request(app).post('/api/cart/items').send({ productId, quantity: 2 });
    const orderRes = await request(app)
      .post('/api/orders')
      .send({ shippingMethod: 'standard' });
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.items[0].productId).toBe(productId);
    expect(orderRes.body.shippingCost).toBe(5);
    expect(orderRes.body.status).toBe('shipped');
  });
});
