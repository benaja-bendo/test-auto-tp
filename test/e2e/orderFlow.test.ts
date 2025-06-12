import request from 'supertest';
import app from '../../src/app';

describe('Order flow E2E', () => {
  it('user can browse, add to cart and order', async () => {
    const products = await request(app).get('/products');
    const productId = products.body[0].id;
    await request(app).post('/cart/items').send({ productId, quantity: 2 });
    const orderRes = await request(app).post('/orders');
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.items[0].productId).toBe(productId);
    expect(orderRes.body.status).toBe('shipped');
  });
});
