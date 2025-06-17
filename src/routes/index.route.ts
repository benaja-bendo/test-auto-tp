import { Router } from 'express';
import { SiteController } from '../controllers/siteController';
import { ProductController } from '../controllers/productController';
import { CartController } from '../controllers/cartController';
import { OrderController } from '../controllers/orderController';

export class Routes {
  constructor(
    private siteController: SiteController,
    private productController: ProductController,
    private cartController: CartController,
    private orderController: OrderController
  ) {}

  public init(): Router {
    const router = Router();

    // Site routes
    router.get('/', this.siteController.home);
    router.get('/products/:id', this.siteController.productPage);
    router.get('/cart', this.siteController.cartPage);
    router.post('/checkout', this.siteController.checkout);
    
    // Partials routes
    router.get('/views/partials/:name', this.siteController.servePartial);

    // API routes
    router.get('/api/products', this.productController.getAll);
    router.get('/api/products/:id', this.productController.getById);

    // Cart routes
    router.get('/cart/items', this.cartController.getItems);
    router.post('/cart/items', this.cartController.addItem);
    router.put('/cart/items', this.cartController.updateItem);
    router.delete('/cart/items/:productId', this.cartController.removeItem);
    router.post('/cart/clear', this.cartController.clearCart);

    // Order routes
    router.post('/api/orders', this.orderController.createOrder);

    return router;
  }
}
