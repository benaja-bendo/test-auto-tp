import request from 'supertest';
import app from '../../src/app';
import { afterEach } from 'vitest';
import { CartService } from '../../src/services/cartService';

// Access cartService for cleanup
const cartService = (app as any).locals?.cartService as CartService;

afterEach(() => {
  cartService?.clear();
});

describe('API', () => {
  it('lists products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('can create order flow', async () => {
    const productRes = await request(app).get('/products');
    const productId = productRes.body[0].id;

    await request(app).post('/cart/items').send({ productId, quantity: 1 });
    const cartRes = await request(app).get('/cart');
    expect(cartRes.body.length).toBe(1);

    const orderRes = await request(app).post('/orders');
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.status).toBe('shipped');
  });
});
