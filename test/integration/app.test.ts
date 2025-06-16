import request from 'supertest';
import app from '../../src/app';
import { afterEach, describe, it, expect } from 'vitest';
import { CartService } from '../../src/services/cartService';

// Access cartService for cleanup
const cartService = (app as any).locals?.cartService as CartService;

afterEach(() => {
  cartService?.clear();
});

describe('API', () => {
  it('lists products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('gets product by id', async () => {
    const list = await request(app).get('/api/products');
    const id = list.body[0].id;
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('can create order flow', async () => {
    const productRes = await request(app).get('/api/products');
    const productId = productRes.body[0].id;

    await request(app).post('/api/cart/items').send({ productId, quantity: 1 });
    const cartRes = await request(app).get('/api/cart');
    expect(cartRes.body.length).toBe(1);

    const orderRes = await request(app).post('/api/orders').send({ shippingMethod: 'standard' });
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.shippingCost).toBe(5);
    expect(orderRes.body.status).toBe('shipped');
  });
});
