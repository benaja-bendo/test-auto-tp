import request from 'supertest';
import app from '../../src/app';
import { describe, it, expect, afterEach } from 'vitest';
import { CartService } from '../../src/services/cartService';

const cartService = (app as any).locals?.cartService as CartService;

describe('Tests End-to-End', () => {
  afterEach(() => {
    cartService?.clear();
  });

  it('parcours complet : navigation, ajout au panier et commande', async () => {
    // 1. Consulter la liste des produits
    const products = await request(app).get('/api/products');
    expect(products.status).toBe(200);
    expect(products.body.length).toBeGreaterThan(0);

    // 2. Consulter un produit spécifique
    const productId = products.body[0].id;
    const productDetail = await request(app).get(`/api/products/${productId}`);
    expect(productDetail.status).toBe(200);
    expect(productDetail.body.id).toBe(productId);

    // 3. Ajouter au panier
    const addToCart = await request(app)
      .post('/api/cart/items')
      .send({ productId, quantity: 2 });
    expect(addToCart.status).toBe(201);

    // 4. Vérifier le contenu du panier
    const cart = await request(app).get('/api/cart/items');
    expect(cart.status).toBe(200);
    expect(cart.body).toHaveLength(1);
    expect(cart.body[0].quantity).toBe(2);

    // 5. Créer la commande
    const orderRes = await request(app)
      .post('/api/orders')
      .send({ shippingMethod: 'standard' });
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.items).toBeDefined();
    expect(orderRes.body.items.length).toBeGreaterThan(0);
    expect(orderRes.body.shippingCost).toBe(5);
    expect(orderRes.body.status).toBe('shipped');
    
    // En mode test, nous savons que le prix du produit 1 est 10
    const expectedTotal = 2 * 10 + 5; // 2 * prix du produit + frais d'expédition
    expect(orderRes.body.total).toBe(expectedTotal);
  });

  it('gestion d\'un panier avec plusieurs produits', async () => {
    // 1. Récupérer les produits
    const products = await request(app).get('/api/products');
    const product1 = products.body[0].id;
    const product2 = products.body[1].id;

    // 2. Ajouter plusieurs produits au panier
    await request(app)
      .post('/api/cart/items')
      .send({ productId: product1, quantity: 2 });
    await request(app)
      .post('/api/cart/items')
      .send({ productId: product2, quantity: 1 });

    // 3. Vérifier le panier
    const cart = await request(app).get('/api/cart/items');
    expect(cart.body).toHaveLength(2);

    // 4. Commander
    const order = await request(app)
      .post('/api/orders')
      .send({ shippingMethod: 'express' });
    expect(order.status).toBe(201);
    expect(order.body.items).toBeDefined();
    expect(order.body.items.length).toBeGreaterThan(0);
    
    // En mode test, nous savons que les prix sont fixes (10 pour le produit 1, 20 pour le produit 2)
    // Le frais d'expédition express est de 10
    const expectedItemsTotal = 2 * 10 + 1 * 20; // 2 * prix du produit 1 + 1 * prix du produit 2
    const expectedTotal = expectedItemsTotal + 10; // Total + frais d'expédition express
    
    expect(order.body.total).toBe(expectedTotal);
  });

  it('modification des quantités dans le panier', async () => {
    // 1. Ajouter un produit
    const products = await request(app).get('/api/products');
    const productId = products.body[0].id;

    await request(app)
      .post('/api/cart/items')
      .send({ productId, quantity: 1 });

    // 2. Modifier la quantité
    await request(app)
      .post('/api/cart/items')
      .send({ productId, quantity: 3 });

    // 3. Vérifier la mise à jour
    const cart = await request(app).get('/api/cart/items');
    expect(cart.body[0].quantity).toBe(4);
  });

  it('gestion des erreurs de commande', async () => {
    // 1. Tenter de commander avec un panier vide
    const emptyOrder = await request(app)
      .post('/api/orders')
      .send({ shippingMethod: 'standard' });
    expect(emptyOrder.status).toBe(400);

    // 2. Tenter d'ajouter un produit invalide
    const invalidProduct = await request(app)
      .post('/api/cart/items')
      .send({ productId: 'invalid', quantity: 1 });
    expect(invalidProduct.status).toBe(400);
    expect(invalidProduct.body.error).toBe('Produit non trouvé');
  });

  it('vérification du total de la commande', async () => {
    // 1. Ajouter des produits
    const products = await request(app).get('/api/products');
    await request(app)
      .post('/api/cart/items')
      .send({ productId: products.body[0].id, quantity: 2 });
    await request(app)
      .post('/api/cart/items')
      .send({ productId: products.body[1].id, quantity: 1 });

    // 2. Vérifier le total
    const order = await request(app)
      .post('/api/orders')
      .send({ shippingMethod: 'standard' });
    
    expect(order.body.total).toBeGreaterThan(0);
    
    // Vérifier que le total est égal à la somme des prix des articles plus les frais d'expédition
    // En mode test, nous savons que les prix sont fixes (10 pour le produit 1, 20 pour le produit 2)
    const expectedItemsTotal = 2 * 10 + 1 * 20; // 2 * prix du produit 1 + 1 * prix du produit 2
    const expectedTotal = expectedItemsTotal + order.body.shippingCost;
    
    expect(order.body.total).toBe(expectedTotal);
  });
});
