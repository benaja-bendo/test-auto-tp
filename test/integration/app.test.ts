import request from 'supertest';
import app from '../../src/app';
import { afterEach, describe, it, expect } from 'vitest';
import { CartService } from '../../src/services/cartService';

// Access cartService for cleanup
const cartService = (app as any).locals?.cartService as CartService;

afterEach(() => {
  cartService?.clear();
});

describe('API Integration Tests', () => {
  describe('Produits', () => {
    it('liste tous les produits', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('récupère un produit par son ID', async () => {
      const list = await request(app).get('/api/products');
      const id = list.body[0].id;
      const res = await request(app).get(`/api/products/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
    });

    it('retourne 404 pour un ID de produit invalide', async () => {
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
    });
  });

  describe('Panier', () => {
    it('ajoute un article au panier', async () => {
      const products = await request(app).get('/api/products');
      const productId = products.body[0].id;
      const res = await request(app)
        .post('/api/cart/items')
        .send({ productId, quantity: 2 });
      expect(res.status).toBe(201);
      
      const cartRes = await request(app).get('/api/cart');
      expect(cartRes.body).toHaveLength(1);
      expect(cartRes.body[0].quantity).toBe(2);
    });

    it('met à jour la quantité d\'un article existant', async () => {
      const products = await request(app).get('/api/products');
      const productId = products.body[0].id;
      
      await request(app)
        .post('/api/cart/items')
        .send({ productId, quantity: 2 });
      
      await request(app)
        .post('/api/cart/items')
        .send({ productId, quantity: 3 });
      
      const cartRes = await request(app).get('/api/cart');
      expect(cartRes.body).toHaveLength(1);
      expect(cartRes.body[0].quantity).toBe(5);
    });

    it('vide le panier', async () => {
      const products = await request(app).get('/api/products');
      const productId = products.body[0].id;
      
      await request(app)
        .post('/api/cart/items')
        .send({ productId, quantity: 1 });
      
      await request(app).delete('/api/cart');
      
      const cartRes = await request(app).get('/api/cart');
      expect(cartRes.body).toHaveLength(0);
    });
  });

  describe('Commandes', () => {
    it('crée une commande avec succès', async () => {
      const productRes = await request(app).get('/api/products');
      const productId = productRes.body[0].id;

      await request(app).post('/api/cart/items').send({ productId, quantity: 1 });
      const orderRes = await request(app)
        .post('/api/orders')
        .send({ shippingMethod: 'standard' });

      expect(orderRes.status).toBe(201);
      expect(orderRes.body.shippingCost).toBe(5);
      expect(orderRes.body.status).toBe('shipped');
    });

    it('vérifie que le panier est vide après une commande réussie', async () => {
      const productRes = await request(app).get('/api/products');
      const productId = productRes.body[0].id;

      await request(app).post('/api/cart/items').send({ productId, quantity: 1 });
      await request(app)
        .post('/api/orders')
        .send({ shippingMethod: 'standard' });

      const cartRes = await request(app).get('/api/cart');
      expect(cartRes.body).toHaveLength(0);
    });

    it('calcule correctement le coût total avec plusieurs articles', async () => {
      const products = await request(app).get('/api/products');
      await request(app)
        .post('/api/cart/items')
        .send({ productId: products.body[0].id, quantity: 2 });
      await request(app)
        .post('/api/cart/items')
        .send({ productId: products.body[1].id, quantity: 1 });

      const orderRes = await request(app)
        .post('/api/orders')
        .send({ shippingMethod: 'standard' });

      expect(orderRes.status).toBe(201);
      expect(orderRes.body.total).toBeGreaterThan(orderRes.body.shippingCost);
    });
  });
});
