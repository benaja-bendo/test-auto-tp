import { Router } from 'express';
import { SiteController } from '../controllers/siteController';
import { ProductController } from '../controllers/productController';
import { CartController } from '../controllers/cartController';
import { OrderController } from '../controllers/orderController';
import { ShippingController } from '../controllers/shippingController';
import { PaymentController } from '../controllers/paymentController';

export class Routes {
  constructor(
    private siteController: SiteController,
    private productController: ProductController,
    private cartController: CartController,
    private orderController: OrderController,
    private shippingController: ShippingController,
    private paymentController: PaymentController
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
    router.patch('/api/products/:id', this.productController.updateProduct);

    // Carriers routes
    router.get('/api/carriers', this.shippingController.getAllCarriers);
    router.get('/api/carriers/:id', this.shippingController.getCarrierById);

    // Payments routes
    router.get('/api/payments', this.paymentController.getAllPayments);
    router.get('/api/payments/:id', this.paymentController.getPaymentById);

    // Cart routes
    router.get('/api/cart/items', this.cartController.getItems);
    router.post('/api/cart/items', this.cartController.addItem);
    router.put('/api/cart/items', this.cartController.updateItem);
    router.delete('/api/cart/items/:productId', this.cartController.removeItem);
    router.post('/api/cart/clear', this.cartController.clearCart);

    // Order routes
    router.post('/api/orders', this.orderController.createOrder);

    // Order routes
    router.post('/api/orders', this.orderController.createOrder);

    return router;
  }
}
